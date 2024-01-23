/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIdbPuzzleAttempts } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import {
  FullUserPuzzleDataResponse,
  isFullUserPuzzleDataResponse,
  isUserPuzzleDataResponse,
  userDataApiSlice,
  UserPuzzleDataResponse,
} from "@/features/userData";
import {
  generateNewAttemptThunk,
  resolveAttemptsData,
  selectCurrentAttemptUuid,
  setAttempts,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import {
  processGuess,
  resolveGuessesData,
  setGuesses,
  setGuessesFromIdbThunk,
  TGuess,
} from "@/features/guesses";
import { RootState } from "@/app/store";
import {
  resolveSearchPanelSearchData,
  SearchPanelSearchData,
  setSearchPanelSearches,
  setSearchPanelSearchesFromIdbThunk,
} from "@/features/searchPanelSearches";
import { devLog, errLog } from "@/util";
import { getIdbAttemptGuesses } from "@/features/guesses/api/guessesIdbApi";
import { getIdbAttemptSearches } from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";
import { DexieGeneralError, isDexieGeneralError } from "@/lib/idb";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts";
import { isUserPuzzleData } from "@/features/userData/types/userDataTypes";
import { last } from "lodash";
import { PromiseExtended } from "dexie";
import { BLANK_UUID, isErrorResponse, Uuid } from "@/features/api";
import { isEmptyArray, isPopulatedArray } from "@/types/globalTypes";

/** A type that consists of either the data from a successful query, set via a generic, plus the
 *  different error types that can result from both RTK Query and Dexie. Null is an option since
 *  that is what this type is initialized as.
 */
type UpdIdbDataItem<DataType> =
  | PromiseExtended<DataType>
  | DataType
  | DexieGeneralError
  | null;

/** This will eventually be used for comparing the server and IndexedDB data
 */
type UserPuzzleDataContainer = {
  serverData: Promise<UserPuzzleDataResponse> | null;
  idbAttempts: UpdIdbDataItem<UserPuzzleAttempt[]>;
  idbGuesses: UpdIdbDataItem<TGuess[]>;
  idbSearches: UpdIdbDataItem<SearchPanelSearchData[]>;
  resolvedFirst: "IDB" | "SERVER" | null;
  guessesResolved: boolean;
  searchesResolved: boolean;
  currentAttemptUuid: Uuid;
  loadInitialGuessDataThunk: Promise<any> | null;
  loadInitialSearchDataThunk: Promise<any> | null;
};

/** Load user puzzle data (attempts, guesses, search panel searches) from both server and IndexedDB.
 * When loaded from the server, all data comes in one query. When loaded from IDB, each type of
 * data is its own query. For IDB, need attempts before fetching guesses and SPSs.
 * Between server and IDB attempts queries, load whichever one returns first, then compare the data
 * to the other query once it returns. Server data takes precedence in case of conflict.
 */
export const getUserPuzzleDataThunk = createAsyncThunk(
  "userData/getUserPuzzleDataThunk",
  async (puzzleId: number, api) => {
    devLog("getUserPuzzleDataThunk");
    const state = api.getState() as RootState;
    const upd: UserPuzzleDataContainer = {
      serverData: null,
      idbAttempts: null,
      idbGuesses: null,
      idbSearches: null,
      resolvedFirst: null,
      guessesResolved: false,
      searchesResolved: false,
      currentAttemptUuid: BLANK_UUID,
      loadInitialGuessDataThunk: null,
      loadInitialSearchDataThunk: null,
    };
    upd.idbAttempts = getIdbPuzzleAttempts(puzzleId);
    upd.serverData = api
      .dispatch(
        userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId, {
          forceRefetch: true,
        }),
      )
      .unwrap();
    // React differently depending on which query (server or IndexedDB) resolves first,
    // and whether it was successful or not.
    Promise.race([upd.idbAttempts, upd.serverData]).then(async (response) => {
      if (Array.isArray(response) && response.length > 0) {
        //IndexedDB query resolved first with success
        devLog("IDB resolved first with success:", response);
        upd.resolvedFirst = "IDB";
        api.dispatch(setAttempts(response));
        upd.currentAttemptUuid = last(response)?.uuid ?? BLANK_UUID;
      } else if (
        isFullUserPuzzleDataResponse(response) &&
        response.data.attempts.length > 0
      ) {
        //Server query resolved first with success
        devLog("Server resolved first with success:", response);
        upd.resolvedFirst = "SERVER";
        api.dispatch(loadUserPuzzleServerData(response));
        upd.currentAttemptUuid =
          last(response.data.attempts)?.uuid ?? BLANK_UUID;
      } else if (isDexieGeneralError(response) || isEmptyArray(response)) {
        //IndexedDB query resolved first with error or empty array
        devLog("IDB resolved first with error or empty array:", response);
        upd.resolvedFirst = "IDB";
      } else if (
        isErrorResponse(response) ||
        (isUserPuzzleDataResponse(response) && !response.isAuthenticated) ||
        (isFullUserPuzzleDataResponse(response) &&
          response.data.attempts.length === 0)
      ) {
        //Server resolved first with error or no data
        devLog("Server resolved first with error or no data:", response);
        upd.resolvedFirst = "SERVER";
      } else {
        //Unexpected response
        errLog("Unexpected response fetching user puzzle data:", response);
      }
      // Only attempt to load IDB guesses and searches if we have a userPuzzleAttempt UUID
      if (upd.currentAttemptUuid !== BLANK_UUID) {
        upd.loadInitialGuessDataThunk = api.dispatch(loadInitialGuessData(upd));
        upd.loadInitialSearchDataThunk = api.dispatch(
          loadInitialSearchData(upd),
        );
      }
    });
    // Once both the server and IDB promises settle, compare them
    const promises = await Promise.allSettled([
      upd.serverData,
      upd.idbAttempts,
      upd.loadInitialGuessDataThunk,
      upd.loadInitialSearchDataThunk,
    ]);
    const serverResult = promises[0];
    const idbAttemptsResult = promises[1];
    devLog("Server and IDB queries all settled", upd);
    devLog("promises =", promises);
    if (
      isIdbSettledSuccess(idbAttemptsResult) &&
      isServerSettledSuccess(serverResult)
    ) {
      //Both queries were successful. Order doesn't matter.
      devLog(
        "Server and IDB attempt queries were both successful and both had length > 0. " +
          "Resolve attempts",
      );
      //Resolve attempts
      api.dispatch(
        resolveAttemptsData({
          idbData: idbAttemptsResult.value,
          serverData: serverResult.value.data.attempts,
        }),
      );
      //Resolve guesses
      if (!upd.guessesResolved) {
        // devLog("Resolve guess data");
        if (Array.isArray(upd.idbGuesses)) {
          // devLog(
          //   "IDB was first to resolve and was successful. Loaded IDB guesses, now resolve guesses",
          // );
          const serverGuessData = serverResult.value.data.guesses.map((guess) =>
            processGuess(guess, state),
          );
          api.dispatch(
            resolveGuessesData({
              idbData: upd.idbGuesses,
              serverData: serverGuessData,
            }),
          );
          upd.guessesResolved = true;
        } else {
          //TODO: If upd.idbGuesses isn't an array, should it attempt to fetch IDB guesses?
          // devLog("upd.idbGuesses isn't an array. Skipping.");
        }
      }
      //Resolve searches
      if (!upd.searchesResolved) {
        // devLog("Resolve search panel search data");
        if (Array.isArray(upd.idbSearches)) {
          // devLog(
          //   "IDB was first to resolve and was successful. Loaded IDB searches, now resolve searches",
          // );
          api.dispatch(
            resolveSearchPanelSearchData({
              idbData: upd.idbSearches,
              serverData: serverResult.value.data.searches,
            }),
          );
        } else {
          //TODO: If upd.idbSearches isn't an array, should it attempt to fetch IDB searches?
          // devLog("upd.idbSearches isn't an array. Skipping.");
        }
      }
    } else if (
      upd.resolvedFirst === "IDB" &&
      !isIdbSettledSuccess(idbAttemptsResult) &&
      isServerSettledSuccess(serverResult)
    ) {
      //IDB was first and failed, server was successful
      devLog(
        "IDB attempts query resolved first but was empty or errored, and server attempts are not" +
          " empty. Setting attempts, guesses, and SPSs to server data.",
      );
      api.dispatch(loadUserPuzzleServerData(serverResult.value));
      //TODO: Still try to load guesses and SPSs from IDB?
    } else if (
      upd.resolvedFirst === "SERVER" &&
      !isServerSettledSuccess(serverResult) &&
      isIdbSettledSuccess(idbAttemptsResult)
    ) {
      //Server was first and failed, IDB was successful
      devLog(
        "Server returned first but errored, and IDB returned successfully. Setting" +
          " attempts to IDB data and then fetching IDB guesses and SPSs.",
      );
      api.dispatch(setAttempts(idbAttemptsResult.value));
      upd.currentAttemptUuid = selectCurrentAttemptUuid(state);
      const idbGuesses = setGuessesFromIdbThunk(upd.currentAttemptUuid);
      const idbSearches = setSearchPanelSearchesFromIdbThunk(
        upd.currentAttemptUuid,
      );
      await Promise.allSettled([idbGuesses, idbSearches]);
    } else if (
      !isIdbSettledSuccess(idbAttemptsResult) &&
      !isServerSettledSuccess(serverResult)
    ) {
      //Both server and IDB failed. Order doesn't matter.
      devLog(
        "Neither server nor IDB returned attempt data. Create a new user puzzle attempt",
      );
      api.dispatch(generateNewAttemptThunk());
    } else {
      //If we got here, that means that the first query succeeded and the second failed.
      // Nothing more needs to happen
      devLog(
        "First query succeeded, second failed. No further processing needed",
      );
    }
  },
);

const loadUserPuzzleServerData = createAsyncThunk(
  "userData/loadUserPuzzleServerData",
  (data: FullUserPuzzleDataResponse, api) => {
    const state = api.getState() as RootState;
    api.dispatch(setAttempts(data.data.attempts));
    api.dispatch(
      setGuesses(data.data.guesses.map((guess) => processGuess(guess, state))),
    );
    api.dispatch(setSearchPanelSearches(data.data.searches));
  },
);

export const loadInitialGuessData = createAsyncThunk(
  "userData/loadInitialGuessData",
  async (upd: UserPuzzleDataContainer, api) => {
    // devLog("loadInitialGuessData");
    //Get IndexedDB guesses
    upd.idbGuesses = await getIdbAttemptGuesses(upd.currentAttemptUuid).catch(
      (err) => {
        errLog("Error fetching IDB guesses:", err);
        return null;
      },
    );
    //If IndexedDB query failed, exit early
    if (!Array.isArray(upd.idbGuesses)) {
      errLog("IDB guesses is not an array. Exiting.", upd.idbGuesses);
      return;
    }
    //If IDB attempts resolved first successfully
    if (upd.resolvedFirst === "IDB") {
      // devLog(
      //   "IDB resolved first and was successful, guesses IDB query was also successful:",
      //   upd.idbGuesses,
      // );
      api.dispatch(setGuesses(upd.idbGuesses));
      return;
    }
    //If server resolved first successfully
    if (upd.resolvedFirst === "SERVER" && isUserPuzzleData(upd.serverData)) {
      // devLog(
      //   "Server resolved first and was successful, guesses IDB query was also successful. " +
      //     "Resolve server and IDB guesses.",
      //   upd.idbGuesses,
      // );
      const state = api.getState() as RootState;
      const serverGuessData = upd.serverData.guesses.map((guess) =>
        processGuess(guess, state),
      );
      api.dispatch(
        resolveGuessesData({
          idbData: upd.idbGuesses,
          serverData: serverGuessData,
        }),
      );
      upd.guessesResolved = true;
    }
  },
);

export const loadInitialSearchData = createAsyncThunk(
  "userData/loadInitialSearchData",
  async (upd: UserPuzzleDataContainer, api) => {
    // devLog("loadInitialSearchData");
    //Get IndexedDB searches
    upd.idbSearches = await getIdbAttemptSearches(upd.currentAttemptUuid).catch(
      (err) => {
        errLog("Error fetching IDB SPSs:", err);
        return null;
      },
    );
    //If IndexedDB query failed, exit early
    if (!Array.isArray(upd.idbSearches)) {
      errLog("IDB searches is not an array. Exiting.", upd.idbSearches);
      return;
    }
    //If IDB attempts resolved first successfully
    if (upd.resolvedFirst === "IDB") {
      // devLog(
      //   "IDB resolved first and was successful, SPSs IDB query was also successful:",
      //   upd.idbSearches,
      // );
      api.dispatch(setSearchPanelSearches(upd.idbSearches));
      return;
    }
    //If server resolved first successfully
    if (upd.resolvedFirst === "SERVER" && isUserPuzzleData(upd.serverData)) {
      // devLog(
      //   "Server resolved first and was successful, SPSs IDB query was also successful. " +
      //     "Resolve server and IDB SPSs.",
      //   upd.idbSearches,
      // );
      api.dispatch(
        resolveSearchPanelSearchData({
          idbData: upd.idbSearches,
          serverData: upd.serverData.searches,
        }),
      );
      upd.searchesResolved = true;
    }
  },
);

type SettledResponse =
  | PromiseSettledResult<UserPuzzleAttempt[]>
  | PromiseSettledResult<UserPuzzleDataResponse>;

export const isIdbSettledSuccess = (
  response: SettledResponse,
): response is PromiseFulfilledResult<UserPuzzleAttempt[]> => {
  return response.status === "fulfilled" && isPopulatedArray(response.value);
};

export const isServerSettledSuccess = (
  response: SettledResponse,
): response is PromiseFulfilledResult<FullUserPuzzleDataResponse> => {
  return (
    response.status === "fulfilled" &&
    isFullUserPuzzleDataResponse(response.value) &&
    response.value.data.attempts.length > 0
  );
};
