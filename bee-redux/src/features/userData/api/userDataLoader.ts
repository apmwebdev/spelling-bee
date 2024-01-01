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
import { BLANK_UUID, isErrorResponse, Statuses, Uuid } from "@/types";
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
} from "@/features/guesses";
import { RootState } from "@/app/store";
import {
  resolveSearchPanelSearchData,
  SearchPanelSearchData,
  setSearchPanelSearches,
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
} from "@/features/userData/types";
import { last } from "lodash";
import { PromiseExtended } from "dexie";
import { RtkqQueryActionCreatorResult } from "@/features/api/types";

/** A type that consists of either the data from a successful query, set via a generic, plus the
 *  different error types that can result from both RTK Query and Dexie. Null is an option since
 *  that is what this type is initialized as.
 */
type UpdIdbDataItem<DataType> =
  | PromiseExtended<DataType>
  | DataType
  | DexieGeneralError
  | null;

type UpdServerDataItem<ResultType, ArgType> = RtkqQueryActionCreatorResult<
  ResultType,
  ArgType
> | null;

/** This will eventually be used for comparing the server and IndexedDB data
 */
type UserPuzzleDataContainer = {
  serverData: UpdServerDataItem<UserPuzzleData, number>;
  idbAttempts: UpdIdbDataItem<UserPuzzleAttempt[]>;
  idbGuesses: UpdIdbDataItem<GuessFormat[]>;
  idbSearches: UpdIdbDataItem<SearchPanelSearchData[]>;
  resolvedFirst: "IDB" | "SERVER" | null;
  firstPromiseSuccessful: boolean;
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
    devLog("Begin getUserPuzzleDataThunk");
    const state = api.getState() as RootState;
    //Create an object to hold the results of the different queries to more easily compare them, and
    // for the initial queries, track which one resolved first.
    const updData: UserPuzzleDataContainer = {
      serverData: null,
      idbAttempts: null,
      idbGuesses: null,
      idbSearches: null,
      resolvedFirst: null,
      firstPromiseSuccessful: true,
    };
    //TODO: Eventually make this use the same process as setting the current attempt in state
    let attemptUuid: Uuid | null = null;
    updData.idbAttempts = getIdbPuzzleAttempts(puzzleId);
    updData.serverData = api.dispatch(
      userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId),
    );
    // React differently depending on which query (server or IndexedDB) resolves first, and
    // whether it was successful or not.
    Promise.race([updData.idbAttempts, updData.serverData]).then(
      async (response) => {
        if (Array.isArray(response)) {
          //IndexedDB resolves first with success
          devLog("ID1-1: IDB resolved first with success:", response);
          updData.resolvedFirst = "IDB";
          api.dispatch(setAttempts(response));
          attemptUuid = last(response)?.uuid ?? BLANK_UUID;
        } else if (isUserPuzzleDataResponse(response)) {
          //Server resolves first with success
          devLog("ID1-2: Server resolved first with success:", response);
          updData.resolvedFirst = "SERVER";
          api.dispatch(loadUserPuzzleServerData(response.data));
          attemptUuid = last(response.data.attempts)?.uuid ?? BLANK_UUID;
        } else if (isDexieGeneralError(response)) {
          //IndexedDB resolves first with error
          devLog("ID1-3: IDB resolved first with error:", response);
          updData.resolvedFirst = "IDB";
          updData.firstPromiseSuccessful = false;
        } else if (isErrorResponse(response)) {
          //Server resolves first with error
          devLog("ID1-4: Server resolved first with error:", response);
          updData.resolvedFirst = "SERVER";
          updData.firstPromiseSuccessful = false;
        } else {
          //If we get here, it means that the response wasn't an expected success OR failure,
          // which is weird. Just log the response and wait for the second query to return.
          devLog(
            "ID1-5: Unexpected response fetching user puzzle data:",
            response,
          );
          updData.firstPromiseSuccessful = false;
        }
        // Only attempt to load IDB guesses and searches if we have a userPuzzleAttempt UUID
        if (updData.firstPromiseSuccessful) {
          devLog(
            "ID2-0: isSuccess = true, meaning we have an attempt UUID for guesses, searches",
          );
          attemptUuid ??= BLANK_UUID;
          updData.idbGuesses = getIdbAttemptGuesses(attemptUuid);
          updData.idbGuesses
            .then((idbResult) => {
              if (state.guesses.status === Statuses.Initial) {
                devLog(
                  "ID2-1-1-1: IDB resolved first and was successful, guesses IDB query was also" +
                    " successful:",
                  idbResult,
                );
                api.dispatch(setGuesses(idbResult));
              } else {
                devLog(
                  "ID2-1-1-2: Server resolved first and was successful, guesses IDB query was also" +
                    " successful. Diff server and IDB guesses.",
                  idbResult,
                );
                if (isUserPuzzleData(updData.serverData)) {
                  resolveGuessesData({
                    idbData: idbResult,
                    serverData: updData.serverData.guesses,
                  });
                }
              }
            })
            .catch((err) => {
              devLog(
                "ID2-1-2: Server resolved first and was successful, error fetching IDB guesses:",
                err,
              );
            });
          updData.idbSearches = getIdbAttemptSearches(attemptUuid);
          updData.idbSearches
            .then((idbResult) => {
              if (state.searchPanelSearches.status === Statuses.Initial) {
                devLog(
                  "ID2-2-1-1: IDB resolved first and was successful, SPSs IDB query was also" +
                    " successful:",
                  idbResult,
                );
                api.dispatch(setSearchPanelSearches(idbResult));
              } else {
                devLog(
                  "ID2-2-1-2: Server resolved first and was successful, SPSs IDB query was also" +
                    " successful. Diff server and IDB SPSs.",
                );
                if (isUserPuzzleData(updData.serverData)) {
                  resolveSearchPanelSearchData({
                    idbData: idbResult,
                    serverData: updData.serverData.searches,
                  });
                }
              }
            })
            .catch((err) => {
              devLog(
                "ID2-2-2: Server resolved first, error fetching IDB SPSs:",
                err,
              );
            });
          await Promise.allSettled([updData.idbGuesses, updData.idbSearches]);
        }
      },
    );
    // Once both the server and IDB promises settle, compare them
    const promises = await Promise.allSettled([
      updData.serverData,
      updData.idbAttempts,
      updData.idbGuesses,
      updData.idbSearches,
    ]);
    const serverResult = promises[0];
    const idbAttemptsResult = promises[1];
    const idbGuessesResult = promises[2];
    const idbSearchesResult = promises[3];
    devLog("ID3: Server and IDB queries all settled", updData);
    if (
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length > 0 &&
      serverResult.status === "fulfilled"
    ) {
      devLog(
        "ID3-1: Server and IDB attempts were both successful and both had length > 0. Diff data",
      );
      if (!serverResult.value.data) {
        /* This *shouldn't* ever happen. If the status is fulfilled, which we check above, there
         * should always be a `value.data` property. This is just to satisfy TypeScript. */
        throw new Error(
          "Server result was successful but doesn't have a 'data' property. This shouldn't happen. Exiting.",
        );
      }
      resolveAttemptsData({
        idbData: idbAttemptsResult.value,
        serverData: serverResult.value.data.attempts,
      });
      //TODO: Diff searches and guesses data as well
    } else if (
      updData.resolvedFirst === "IDB" &&
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length === 0 &&
      serverResult.status === "fulfilled" &&
      serverResult.value.data
    ) {
      devLog(
        "ID3-2: IDB attempts query resolved first but was empty, and server attempts are not" +
          " empty. Setting attempts, guesses, and SPSs to server data.",
      );
      api.dispatch(loadUserPuzzleServerData(serverResult.value.data));
      //TODO: Still try to load guesses and SPSs from IDB?
    } else if (
      idbAttemptsResult.status === "rejected" &&
      updData.resolvedFirst === "IDB" &&
      serverResult.status === "fulfilled" &&
      isUserPuzzleDataResponse(serverResult.value)
    ) {
      devLog(
        "ID3-3: IDB resolved first but errored, and server returned successfully. Setting" +
          " attempts, guesses, and SPSs to server data.",
      );
      api.dispatch(loadUserPuzzleServerData(serverResult.value.data));
      //TODO: Still try to load guesses and SPSs from IDB?
    } else if (
      updData.resolvedFirst === "SERVER" &&
      serverResult.status === "rejected" &&
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length > 0
    ) {
      devLog(
        "ID3-4: Server returned first but errored, and IDB returned successfully. Setting" +
          " attempts to IDB data and then fetching IDB guesses and SPSs.",
      );
      api.dispatch(setAttempts(idbAttemptsResult.value));
      attemptUuid = selectCurrentAttemptUuid(state);
      const idbGuesses = getIdbAttemptGuesses(attemptUuid)
        .then((idbResult) => {
          devLog("ID3-4-1-1: Guesses loaded successfully from IDB:", idbResult);
          api.dispatch(setGuesses(idbResult));
        })
        .catch((err) => {
          devLog("ID3-4-1-2: Error loading guesses from IDB:", err);
        });
      const idbSearches = getIdbAttemptSearches(attemptUuid)
        .then((idbResult) => {
          devLog("ID3-4-2-1: SPSs loaded successfully from IDB:", idbResult);
          api.dispatch(setSearchPanelSearches(idbResult));
        })
        .catch((err) => {
          devLog(
            "ID3-4-2-2: Error loading search panel searches from IDB:",
            err,
          );
        });
      await Promise.allSettled([idbGuesses, idbSearches]);
    } else if (
      updData.resolvedFirst === "SERVER" &&
      serverResult.status === "rejected" &&
      idbAttemptsResult.status === "fulfilled" &&
      idbAttemptsResult.value.length === 0
    ) {
      devLog(
        "ID3-5: Server returned first but errored, IDB returned successfully but was empty." +
          " Create a new user puzzle attempt and don't attempt to load guesses or searches from" +
          "IDB.",
      );
      api.dispatch(generateNewAttemptThunk());
    } else {
      devLog(
        "ID3-6: Both IDB and server returned errors. Create a new user puzzle attempt and don't" +
          " attempt to load guesses or searches from IDB.",
      );
      api.dispatch(generateNewAttemptThunk());
    }
  },
);

export const loadUserPuzzleServerData = createAsyncThunk(
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

export const loadIdbAttemptGuesses = createAsyncThunk(
  "userData/loadIdbAttemptGuesses",
  (attemptUuid: Uuid, api) => {
    getIdbAttemptGuesses(attemptUuid)
      .then((idbResult) => {
        devLog("Guesses loaded successfully from IDB:", idbResult);
        api.dispatch(setGuesses(idbResult));
      })
      .catch((err) => {
        devLog("Error loading guesses from IDB:", err);
      });
  },
);

export const loadIdbAttemptSearches = createAsyncThunk(
  "userData/loadIdbAttemptSearches",
  (attemptUuid: Uuid, api) => {
    getIdbAttemptSearches(attemptUuid)
      .then((idbResult) => {
        devLog("SPSs loaded successfully from IDB:", idbResult);
        api.dispatch(setSearchPanelSearches(idbResult));
      })
      .catch((err) => {
        devLog("Error loading search panel searches from IDB:", err);
      });
  },
);
