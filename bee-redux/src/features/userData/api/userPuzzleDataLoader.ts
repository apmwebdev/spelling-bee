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
import { RootState } from "@/app/store";
import { getIdbUserPuzzleData } from "@/features/userData/api/userPuzzleDataIdbApi";
import {
  mergeAttemptsDataThunk,
  selectAttempts,
  setAttempts,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import { selectGuesses, setGuesses } from "@/features/guesses";
import {
  selectSearchPanelSearches,
  setSearchPanelSearches,
} from "@/features/searchPanelSearches";
import {
  isFullUserPuzzleDataResponse,
  isUserPuzzleDataResponse,
  userDataApiSlice,
} from "@/features/userData";
import { errLog } from "@/util";

export const getUserPuzzleDataThunk = createAsyncThunk(
  "userPuzzleData/getUserPuzzleDataThunk",
  async (puzzleId: number, api) => {
    const state = api.getState() as RootState;
    // Get IndexedDB data first, as that should always be faster than the server
    try {
      const idbData = await getIdbUserPuzzleData(puzzleId);
      if (idbData.attempts.length > 0) {
        api.dispatch(setAttempts(idbData.attempts));
        if (idbData.guesses.length > 0) {
          api.dispatch(setGuesses(idbData.guesses));
        }
        if (idbData.searches.length > 0) {
          api.dispatch(setSearchPanelSearches(idbData.searches));
        }
      }
    } catch (err) {
      errLog("Couldn't fetch user puzzle data from IndexedDB:", err);
    }

    // Get server data next
    try {
      const serverData = await api
        .dispatch(
          userDataApiSlice.endpoints.getUserPuzzleData.initiate(puzzleId, {
            forceRefetch: true,
          }),
        )
        .unwrap();
      if (!isUserPuzzleDataResponse(serverData)) {
        errLog("Invalid server response:", serverData);
        return;
      }
      // Server response was successful
      if (isFullUserPuzzleDataResponse(serverData)) {
        // IDB response was also successful
        if (selectAttempts(state).length > 0) {
          api.dispatch(mergeAttemptsDataThunk(serverData.data.attempts));
          if (selectGuesses(state).length > 0) {
            /* TODO: This maybe needs to be abstracted into its own thunk. There are several paths here.
             *   Basically, any combination of server or IDB guesses being empty or not empty needs to be
             *   accounted for. */
          }
          if (selectSearchPanelSearches(state).length > 0) {
            // TODO: See comment above about resolving guess data. The same applies to searches.
          }
        } else {
          // TODO: IDB response was not successful. Just load server data directly into state.
        }
      }
    } catch (err) {
      errLog("Couldn't fetch user puzzle data from server:", err);
    }
  },
);
