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
import { AttemptFormat } from "@/features/userPuzzleAttempts";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

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
  idbAttempts: StatusItem<Array<AttemptFormat>>;
  idbGuesses: StatusItem<Array<GuessFormat>>;
  idbSearchPanelSearches: StatusItem<Array<SearchPanelSearchData>>;
  resolvedFirst: "IDB" | "SERVER" | null;
};

export const getUserPuzzleDataThunk = createAsyncThunk(
  "userData/getUserPuzzleDataThunk",
  async (puzzleId: number, api) => {
    devLog("Begin getUserPuzzleDataThunk");
    const state = api.getState() as RootState;
    //Create an object to hold the results of the different queries, and for the initial
    // queries, track which one resolved first.
    const userPuzzleDataStatus: UserPuzzleDataStatus = {
      serverData: null,
      idbAttempts: null,
      idbGuesses: null,
      idbSearchPanelSearches: null,
      resolvedFirst: null,
    };
    let currentAttemptUuid: Uuid | null = null;
    // First, fetch IDB attempts and server userPuzzleData
    const idbAttempts = getIdbPuzzleAttempts(puzzleId);
    const serverUserPuzzleData = api.dispatch(
      userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId),
    );
    // React differently depending on which query (server or IndexedDB) resolves first, and
    // whether this first promise to resolve was successful or not.
    Promise.race([idbAttempts, serverUserPuzzleData]).then(async (response) => {
      let isSuccess = true;
      if (Array.isArray(response)) {
        //When IndexedDB resolves first and is successful
        devLog("ID1-1: IDB resolved first and was successful:", response);
        userPuzzleDataStatus.resolvedFirst = "IDB";
        userPuzzleDataStatus.idbAttempts = response;
        api.dispatch(setAttempts(response));
      } else if (isUserPuzzleDataResponse(response)) {
        //When the server resolves first and is successful
        devLog("ID1-2: Server resolved first and was successful:", response);
        userPuzzleDataStatus.resolvedFirst = "SERVER";
        userPuzzleDataStatus.serverData = response.data;
        api.dispatch(setAttempts(response.data.attempts));
        api.dispatch(
          setGuesses(
            response.data.guesses.map((guess) => processGuess(guess, state)),
          ),
        );
        api.dispatch(setSearchPanelSearches(response.data.searches));
      } else if (isDexieGeneralError(response)) {
        //When the IndexedDB query resolves first and errors
        devLog("ID1-3: IDB resolved first and errored:", response);
        userPuzzleDataStatus.idbAttempts = response;
        userPuzzleDataStatus.resolvedFirst = "IDB";
        isSuccess = false;
      } else if (isErrorResponse(response)) {
        //When the server query resolves first and errors
        devLog("ID1-4: Server resolved first and errored:", response);
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
        currentAttemptUuid = selectCurrentAttemptUuid(state);
        const idbGuesses = getIdbAttemptGuesses(currentAttemptUuid)
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
        const idbSearches = getIdbAttemptSearches(currentAttemptUuid)
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
      //Diff data
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
      const serverData = serverResult.value.data;
      api.dispatch(setAttempts(serverData.attempts));
      api.dispatch(
        setGuesses(
          serverData.guesses.map((guess) => processGuess(guess, state)),
        ),
      );
      api.dispatch(setSearchPanelSearches(serverData.searches));
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
      api.dispatch(setAttempts(serverResult.value.data.attempts));
      api.dispatch(
        setGuesses(
          serverResult.value.data.guesses.map((guess) =>
            processGuess(guess, state),
          ),
        ),
      );
      api.dispatch(setSearchPanelSearches(serverResult.value.data.searches));
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
      currentAttemptUuid = selectCurrentAttemptUuid(state);
      const idbGuesses = getIdbAttemptGuesses(currentAttemptUuid)
        .then((idbResult) => {
          devLog("ID3-4-1-1: Guesses loaded successfully from IDB:", idbResult);
          api.dispatch(setGuesses(idbResult));
        })
        .catch((err) => {
          devLog("ID3-4-1-2: Error loading guesses from IDB:", err);
        });
      const idbSearches = getIdbAttemptSearches(currentAttemptUuid)
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
