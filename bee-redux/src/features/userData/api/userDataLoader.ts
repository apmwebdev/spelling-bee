/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { getIdbPuzzleAttempts } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import { userDataApiSlice } from "@/features/userData";
import {
  isErrorResponse,
  isUserPuzzleDataResponse,
  Statuses,
  UserPuzzleData,
  Uuid,
} from "@/types";
import {
  generateNewAttemptThunk,
  resolveAttemptsData,
  selectCurrentAttemptUuid,
  setAttempts,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import { GuessFormat, processGuess, setGuesses } from "@/features/guesses";
import { RootState } from "@/app/store";
import {
  SearchPanelSearchData,
  setSearchPanelSearches,
} from "@/features/searchPanelSearches";
import { devLog } from "@/util";
import { getIdbAttemptGuesses } from "@/features/guesses/api/guessesIdbApi";
import { getIdbAttemptSearches } from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";
import { DexieGeneralError, isDexieGeneralError } from "@/lib/idb";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { NullableDiffContainer } from "@/features/api/types";

/** A type that consists of either the data from a successful query, set via a generic, plus the
 *  different error types that can result from both RTK Query and Dexie. Null is an option since
 *  that is what this type is initialized as.
 */
type StatusItem<DataType> =
  | DataType
  | FetchBaseQueryError
  | SerializedError
  | DexieGeneralError
  | null;

/** This will eventually be used for comparing the server and IndexedDB data
 */
type UserPuzzleDataStatus = {
  serverData: StatusItem<UserPuzzleData>;
  idbAttempts: StatusItem<Array<UserPuzzleAttempt>>;
  idbGuesses: StatusItem<Array<GuessFormat>>;
  idbSearchPanelSearches: StatusItem<Array<SearchPanelSearchData>>;
  resolvedFirst: "IDB" | "SERVER" | null;
};

/** Load user puzzle data (attempts, guesses, search panel searches) from both server and IndexedDB.
 * When loaded from the server, all data comes in one query. When loaded from IDB, each type of
 * data is its own query. For IDB, need attempts before fetching guesses and SPSs.
 * Between server and IDB attempts queries, load whichever one returns first, then compare the data
 * to the other query once it returns. Server data is source of truth.
 */
export const getUserPuzzleDataThunk = createAsyncThunk(
  "userData/getUserPuzzleDataThunk",
  async (puzzleId: number, api) => {
    devLog("Begin getUserPuzzleDataThunk");
    const state = api.getState() as RootState;
    //Create an object to hold the results of the different queries to more easily compare them, and
    // for the initial queries, track which one resolved first.
    const userPuzzleDataStatus: UserPuzzleDataStatus = {
      serverData: null,
      idbAttempts: null,
      idbGuesses: null,
      idbSearchPanelSearches: null,
      resolvedFirst: null,
    };
    let attemptUuid: Uuid | null = null;
    const idbAttempts = getIdbPuzzleAttempts(puzzleId);
    const serverUserPuzzleData = api.dispatch(
      userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId),
    );
    // React differently depending on which query (server or IndexedDB) resolves first, and
    // whether it was successful or not.
    Promise.race([idbAttempts, serverUserPuzzleData]).then(async (response) => {
      let isSuccess = true;
      if (Array.isArray(response)) {
        //IndexedDB resolves first with success
        devLog("ID1-1: IDB resolved first with success:", response);
        userPuzzleDataStatus.resolvedFirst = "IDB";
        userPuzzleDataStatus.idbAttempts = response;
        api.dispatch(setAttempts(response));
      } else if (isUserPuzzleDataResponse(response)) {
        //Server resolves first with success
        devLog("ID1-2: Server resolved first with success:", response);
        userPuzzleDataStatus.resolvedFirst = "SERVER";
        userPuzzleDataStatus.serverData = response.data;
        api.dispatch(loadUserPuzzleServerData(response.data));
      } else if (isDexieGeneralError(response)) {
        //IndexedDB resolves first with error
        devLog("ID1-3: IDB resolved first with error:", response);
        userPuzzleDataStatus.idbAttempts = response;
        userPuzzleDataStatus.resolvedFirst = "IDB";
        isSuccess = false;
      } else if (isErrorResponse(response)) {
        //Server resolves first with error
        devLog("ID1-4: Server resolved first with error:", response);
        userPuzzleDataStatus.serverData = response.error;
        userPuzzleDataStatus.resolvedFirst = "SERVER";
        isSuccess = false;
      } else {
        //If we get here, it means that the response wasn't an expected success OR failure,
        // which is weird. Just log the response and wait for the second query to return.
        devLog(
          "ID1-5: Unexpected response fetching user puzzle data:",
          response,
        );
        isSuccess = false;
      }
      // Only attempt to load IDB guesses and searches if we have a userPuzzleAttempt UUID
      if (isSuccess) {
        devLog("ID2-0: isSuccess = true");
        attemptUuid = selectCurrentAttemptUuid(state);
        const idbGuesses = getIdbAttemptGuesses(attemptUuid)
          .then((idbResult) => {
            userPuzzleDataStatus.idbGuesses = idbResult;
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
              //Diff data
            }
          })
          .catch((err) => {
            devLog(
              "ID2-1-2: Server resolved first and was successful, error fetching IDB guesses:",
              err,
            );
            userPuzzleDataStatus.idbGuesses = err;
          });
        const idbSearches = getIdbAttemptSearches(attemptUuid)
          .then((idbResult) => {
            userPuzzleDataStatus.idbSearchPanelSearches = idbResult;
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
              //Diff data
            }
          })
          .catch((err) => {
            devLog(
              "ID2-2-2: Server resolved first, error fetching IDB SPSs:",
              err,
            );
            userPuzzleDataStatus.idbSearchPanelSearches = err;
          });
        // Wait for the IDB queries to settle before continuing
        await Promise.allSettled([idbGuesses, idbSearches]);
      }
    });
    // Once both the server and IDB promises settle, compare them
    const promisesResult = await Promise.allSettled([
      idbAttempts,
      serverUserPuzzleData,
    ]);
    const idbAttemptsResult = promisesResult[0];
    const serverResult = promisesResult[1];
    devLog(
      "ID3: Server and IDB both returned",
      idbAttemptsResult,
      serverResult,
    );
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
      //Diff data
      resolveAttemptsData({
        idbData: idbAttemptsResult.value,
        serverData: serverResult.value.data.attempts,
      });
    } else if (
      userPuzzleDataStatus.resolvedFirst === "IDB" &&
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
    } else if (
      idbAttemptsResult.status === "rejected" &&
      userPuzzleDataStatus.resolvedFirst === "IDB" &&
      serverResult.status === "fulfilled" &&
      isUserPuzzleDataResponse(serverResult.value)
    ) {
      devLog(
        "ID3-3: IDB resolved first but errored, and server returned successfully. Setting" +
          " attempts, guesses, and SPSs to server data.",
      );
      api.dispatch(loadUserPuzzleServerData(serverResult.value.data));
    } else if (
      userPuzzleDataStatus.resolvedFirst === "SERVER" &&
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
      userPuzzleDataStatus.resolvedFirst === "SERVER" &&
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

export const resolveGuesses = (data: NullableDiffContainer<GuessFormat>) => {
  //do stuff
};
