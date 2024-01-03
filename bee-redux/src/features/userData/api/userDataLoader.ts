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
import { userDataApiSlice } from "@/features/userData";
import {
  generateNewAttemptThunk,
  resolveAttemptsData,
  selectCurrentAttemptUuid,
  setAttempts,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import {
  GuessFormat,
  processGuess,
  resolveGuessesData,
  setGuesses,
  setGuessesFromIdbThunk,
} from "@/features/guesses";
import { RootState } from "@/app/store";
import {
  resolveSearchPanelSearchData,
  SearchPanelSearchData,
  setSearchPanelSearches,
  setSearchPanelSearchesFromIdbThunk,
} from "@/features/searchPanelSearches";
import { devLog } from "@/util";
import { getIdbAttemptGuesses } from "@/features/guesses/api/guessesIdbApi";
import { getIdbAttemptSearches } from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";
import { DexieGeneralError, isDexieGeneralError } from "@/lib/idb";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts";
import {
  isUserPuzzleData,
  isUserPuzzleDataResponse,
  UserPuzzleData,
} from "@/features/userData/types/userDataTypes";
import { last } from "lodash";
import { PromiseExtended } from "dexie";
import { BLANK_UUID, isErrorResponse, Uuid } from "@/features/api";

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
  serverData: Promise<UserPuzzleData> | null;
  idbAttempts: UpdIdbDataItem<UserPuzzleAttempt[]>;
  idbGuesses: UpdIdbDataItem<GuessFormat[]>;
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
      .dispatch(userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId))
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
      } else if (isUserPuzzleDataResponse(response)) {
        //Server query resolved first with success
        devLog("Server resolved first with success:", response);
        upd.resolvedFirst = "SERVER";
        api.dispatch(loadUserPuzzleServerData(response.data));
        upd.currentAttemptUuid =
          last(response.data.attempts)?.uuid ?? BLANK_UUID;
      } else if (
        isDexieGeneralError(response) ||
        (Array.isArray(response) && response.length === 0)
      ) {
        //IndexedDB query resolved first with error or empty array
        devLog("IDB resolved first with error or empty array:", response);
        upd.resolvedFirst = "IDB";
      } else if (isErrorResponse(response)) {
        //Server resolved first with error
        devLog("Server resolved first with error:", response);
        upd.resolvedFirst = "SERVER";
      } else {
        //Unexpected response
        devLog("Unexpected response fetching user puzzle data:", response);
      }
      // Only attempt to load IDB guesses and searches if we have a userPuzzleAttempt UUID
      if (upd.currentAttemptUuid !== BLANK_UUID) {
        devLog(
          `currentAttemptUuid present: ${upd.currentAttemptUuid}. Fetching searches, guesses from IndexedDB`,
        );
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
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length > 0 &&
      serverResult.status === "fulfilled" &&
      isUserPuzzleData(serverResult.value)
    ) {
      //Both queries were successful. Order doesn't matter.
      devLog(
        "Server and IDB attempt queries were both successful and both had length > 0. " +
          "Resolve attempts",
      );
      //Resolve attempts
      resolveAttemptsData({
        idbData: idbAttemptsResult.value,
        serverData: serverResult.value.attempts,
      });
      //Resolve guesses
      if (!upd.guessesResolved) {
        devLog("Resolve guess data");
        if (Array.isArray(upd.idbGuesses)) {
          devLog(
            "IDB was first to resolve and was successful. Loaded IDB guesses, now resolve guesses",
          );
          resolveGuessesData({
            idbData: upd.idbGuesses,
            serverData: serverResult.value.guesses,
          });
          upd.guessesResolved = true;
        } else {
          devLog("upd.idbGuesses isn't an array. Skipping.");
        }
      }
      //Resolve searches
      if (!upd.searchesResolved) {
        devLog("Resolve search panel search data");
        if (Array.isArray(upd.idbSearches)) {
          devLog(
            "IDB was first to resolve and was successful. Loaded IDB searches, now resolve searches",
          );
          resolveSearchPanelSearchData({
            idbData: upd.idbSearches,
            serverData: serverResult.value.searches,
          });
        } else {
          devLog("upd.idbSearches isn't an array. Skipping.");
        }
      }
    } else if (
      upd.resolvedFirst === "IDB" &&
      isErrorOrEmpty(idbAttemptsResult) &&
      serverResult.status === "fulfilled"
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
      serverResult.status === "rejected" &&
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length > 0
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
      serverResult.status === "rejected" &&
      isErrorOrEmpty(idbAttemptsResult)
    ) {
      //Both server and IDB failed. Order doesn't matter.
      devLog(
        "Neither server nor IDB returned attempt data. Create a new user puzzle attempt",
      );
      api.dispatch(generateNewAttemptThunk());
    }
  },
);

const loadUserPuzzleServerData = createAsyncThunk(
  "userData/loadUserPuzzleServerData",
  (data: UserPuzzleData, api) => {
    const state = api.getState() as RootState;
    api.dispatch(setAttempts(data.attempts));
    api.dispatch(
      setGuesses(data.guesses.map((guess) => processGuess(guess, state))),
    );
    api.dispatch(setSearchPanelSearches(data.searches));
  },
);

export const loadInitialGuessData = createAsyncThunk(
  "userData/loadInitialGuessData",
  async (upd: UserPuzzleDataContainer, api) => {
    devLog("loadInitialGuessData");
    //Get IndexedDB guesses
    upd.idbGuesses = await getIdbAttemptGuesses(upd.currentAttemptUuid).catch(
      (err) => {
        devLog("Error fetching IDB guesses:", err);
        return null;
      },
    );
    //If IndexedDB query failed, exit early
    if (!Array.isArray(upd.idbGuesses)) {
      devLog("IDB guesses is not an array. Exiting.", upd.idbGuesses);
      return;
    }
    //If IDB attempts resolved first successfully
    if (upd.resolvedFirst === "IDB") {
      devLog(
        "IDB resolved first and was successful, guesses IDB query was also successful:",
        upd.idbGuesses,
      );
      api.dispatch(setGuesses(upd.idbGuesses));
      return;
    }
    //If server resolved first successfully
    if (upd.resolvedFirst === "SERVER" && isUserPuzzleData(upd.serverData)) {
      devLog(
        "Server resolved first and was successful, guesses IDB query was also successful. " +
          "Resolve server and IDB guesses.",
        upd.idbGuesses,
      );
      resolveGuessesData({
        idbData: upd.idbGuesses,
        serverData: upd.serverData.guesses,
      });
      upd.guessesResolved = true;
    }
  },
);

export const loadInitialSearchData = createAsyncThunk(
  "userData/loadInitialSearchData",
  async (upd: UserPuzzleDataContainer, api) => {
    devLog("loadInitialSearchData");
    //Get IndexedDB searches
    upd.idbSearches = await getIdbAttemptSearches(upd.currentAttemptUuid).catch(
      (err) => {
        devLog("Error fetching IDB SPSs:", err);
        return null;
      },
    );
    //If IndexedDB query failed, exit early
    if (!Array.isArray(upd.idbSearches)) {
      devLog("IDB searches is not an array. Exiting.", upd.idbSearches);
      return;
    }
    //If IDB attempts resolved first successfully
    if (upd.resolvedFirst === "IDB") {
      devLog(
        "IDB resolved first and was successful, SPSs IDB query was also successful:",
        upd.idbSearches,
      );
      api.dispatch(setSearchPanelSearches(upd.idbSearches));
      return;
    }
    //If server resolved first successfully
    if (upd.resolvedFirst === "SERVER" && isUserPuzzleData(upd.serverData)) {
      devLog(
        "Server resolved first and was successful, SPSs IDB query was also successful. " +
          "Resolve server and IDB SPSs.",
        upd.idbSearches,
      );
      resolveSearchPanelSearchData({
        idbData: upd.idbSearches,
        serverData: upd.serverData.searches,
      });
      upd.searchesResolved = true;
    }
  },
);

export const isErrorOrEmpty = (promise: PromiseSettledResult<Array<any>>) => {
  return promise.status === "rejected" || promise.value.length === 0;
};
