/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { calculateScore, devLog } from "@/util";
import {
  isBasicSuccessResponse,
  isErrorResponse,
  isUuid,
  Statuses,
  Uuid,
} from "@/types";
import { guessesApiSlice, GuessFormat, isGuess } from "@/features/guesses";
import { createUuidSyncThunk } from "@/features/api/util/synchronizer";
import {
  createDiffPromiseContainer,
  DataSourceKeys,
  DiffContainer,
  UuidUpdateData,
} from "@/features/api/types";
import { combineForDisplayAndSync } from "@/features/api";
import {
  addIdbGuess,
  bulkAddIdbGuesses,
  bulkDeleteIdbGuesses,
  updateIdbGuessUuids,
} from "@/features/guesses/api/guessesIdbApi";

export type GuessesState = {
  data: GuessFormat[];
  status: Statuses;
};

const initialState: GuessesState = {
  data: [],
  status: Statuses.Initial,
};

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    setGuesses: (state, { payload }: PayloadAction<GuessFormat[]>) => {
      state.data = payload;
      state.status = Statuses.UpToDate;
    },
    addGuess: (state, { payload }: PayloadAction<GuessFormat>) => {
      state.data.push(payload);
    },
    deleteGuess: (state, { payload }: PayloadAction<Uuid>) => {
      if (!isUuid(payload)) {
        devLog("Can't delete guess: Invalid UUID.", payload);
        return;
      }
      const guessIndexToDelete = state.data.findIndex(
        (guess) => guess.uuid === payload,
      );
      if (guessIndexToDelete === -1) {
        devLog("Can't delete guess: Not found.", payload);
        return;
      }
      state.data.splice(guessIndexToDelete, 1);
    },
    updateGuessUuids: (state, { payload }: PayloadAction<UuidUpdateData[]>) => {
      for (const item of payload) {
        const guessToChange = state.data.find(
          (guess) => guess.uuid === item.oldUuid,
        );
        if (!guessToChange) continue;
        guessToChange.uuid = item.newUuid;
      }
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addMatcher(
    //     guessesApiSlice.endpoints.getGuesses.matchFulfilled,
    //     (state, { payload }) => {
    //       state.data = payload;
    //     },
    //   )
    //   .addMatcher(
    //     guessesApiSlice.endpoints.addGuess.matchFulfilled,
    //     (state, { payload }) => {
    //       state.data.push(payload);
    //     },
    //   );
  },
});

export const { setGuesses, addGuess, deleteGuess, updateGuessUuids } =
  guessesSlice.actions;

export const addGuessThunk = createAsyncThunk(
  "guesses/addGuessThunk",
  async (guess: GuessFormat, api) => {
    if (!isGuess(guess)) {
      //TODO: Add better error handling
      devLog("Invalid guess. Exiting");
      return;
    }
    const state = api.getState() as RootState;
    const originalUuid = guess.uuid;
    api.dispatch(addGuess(guess));
    const results = createDiffPromiseContainer<GuessFormat, GuessFormat>();
    results.idbData = await addIdbGuess(guess);
    if (!state.auth.isGuest) {
      results.serverData = await api.dispatch(
        guessesApiSlice.endpoints.addGuess.initiate(guess),
      );
    }
    //If neither DB saved the attempt, remove it from Redux as well
    if (
      results.idbData === null &&
      (isErrorResponse(results.serverData) || results.serverData === null)
    ) {
      //TODO: Add better error handling
      devLog("Couldn't save guess locally or remotely. Deleting.");
      api.dispatch(deleteGuess(originalUuid));
      return;
    }
    //TODO: Check UUIDs to make sure they match in all places
  },
);

export const syncGuessUuids = createUuidSyncThunk({
  serverUuidUpdateFn: guessesApiSlice.endpoints.updateGuessUuids.initiate,
  idbUuidUpdateFn: updateIdbGuessUuids,
  stateUuidUpdateFn: updateGuessUuids,
});

export const resolveGuessesData = createAsyncThunk(
  "guesses/resolveGuessesData",
  async (data: DiffContainer<GuessFormat>, api) => {
    //do stuff
    const { displayData, idbDataToAdd, serverDataToAdd, dataToDelete } =
      combineForDisplayAndSync({
        data,
        primaryDataKey: DataSourceKeys.serverData,
      });
    api.dispatch(setGuesses(displayData));
    //For guesses that exist in IDB but not the server, save them to the server
    const idbAndReduxUuidsToUpdate: UuidUpdateData[] = [];
    const serverResult = await api
      .dispatch(
        guessesApiSlice.endpoints.addBulkGuesses.initiate(serverDataToAdd),
      )
      .catch((err) => {
        //TODO: Add better error handling
        devLog("Error bulk updating attempts:", err);
        return null;
      });
    if (isBasicSuccessResponse(serverResult)) {
      for (const result of serverResult.data) {
        //TODO: Handle errors somehow?
        if (result.isSuccess && result.newUuid) {
          idbAndReduxUuidsToUpdate.push({
            oldUuid: result.uuid,
            newUuid: result.newUuid,
          });
        }
      }
    }
    await bulkDeleteIdbGuesses(dataToDelete);
    const idbResult = await bulkAddIdbGuesses(idbDataToAdd).catch((err) => {
      //TODO: Add better error handling
      devLog("Error bulk updating IDB attempts:", err);
      return null;
    });
    if (
      idbAndReduxUuidsToUpdate.length > 0 ||
      (idbResult && idbResult.length > 0)
    ) {
      devLog("Need to sync UUIDs");
      await api.dispatch(
        syncGuessUuids({
          serverData: idbAndReduxUuidsToUpdate,
          idbData: idbResult ?? [],
        }),
      );
    }
  },
);

export const selectGuesses = (state: RootState) => state.guesses.data;
export const selectGuessWords = createSelector([selectGuesses], (guesses) =>
  guesses.map((guess) => guess.text),
);
export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer && !guess.isSpoiled),
);
export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guesses) =>
    guesses
      .filter((guess) => guess.isAnswer && !guess.isSpoiled)
      .map((guess) => guess.text),
);
export const selectSpoiledWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isSpoiled).map((guess) => guess.text),
);
export const selectWrongGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => !guess.isAnswer),
);
export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export default guessesSlice.reducer;
