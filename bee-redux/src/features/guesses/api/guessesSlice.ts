/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { devLog } from "@/util";
import { createInitialState, Statuses } from "@/types/globalTypes";
import { guessesApiSlice } from "@/features/guesses/api/guessesApiSlice";
import { isGuess, TGuess } from "@/features/guesses/types/guessTypes";
import {
  createAddItemThunk,
  createDataResolverThunk,
  createSetDataFromIdbThunk,
  createUuidSyncThunk,
  createUuidUpdateReducer,
} from "@/features/api/util/synchronizer";
import { DataSourceKeys, isUuid, Uuid } from "@/features/api/types/apiTypes";
import {
  addIdbGuess,
  bulkAddIdbGuesses,
  bulkDeleteIdbGuesses,
  getIdbAttemptGuesses,
  updateIdbGuessUuids,
} from "@/features/guesses/api/guessesIdbApi";

const modelDisplayName = "guess";

const initialState = createInitialState<TGuess[]>([]);

const updateGuessUuidsReducer = createUuidUpdateReducer<TGuess[]>({
  modelDisplayName,
});

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    setGuesses: (state, { payload }: PayloadAction<TGuess[]>) => {
      state.data = payload;
      state.status = Statuses.UpToDate;
    },
    addGuess: (state, { payload }: PayloadAction<TGuess>) => {
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
    updateGuessUuids: updateGuessUuidsReducer,
  },
  extraReducers: (builder) => {},
});

export const { setGuesses, addGuess, deleteGuess, updateGuessUuids } =
  guessesSlice.actions;

export const addGuessThunk = createAddItemThunk<TGuess>({
  itemDisplayType: "guess",
  actionType: "guesses/addGuessThunk",
  validationFn: isGuess,
  addItemReducer: addGuess,
  deleteItemReducer: deleteGuess,
  addIdbItemFn: addIdbGuess,
  addServerItemEndpoint: guessesApiSlice.endpoints.addGuess,
});

export const syncGuessUuids = createUuidSyncThunk({
  serverUuidUpdateFn: guessesApiSlice.endpoints.updateGuessUuids.initiate,
  idbUuidUpdateFn: updateIdbGuessUuids,
  stateUuidUpdateFn: updateGuessUuids,
});

export const resolveGuessesData = createDataResolverThunk<TGuess>({
  modelDisplayName: "guess",
  actionType: "guesses/resolveGuessesData",
  primaryDataKey: DataSourceKeys.serverData,
  setDataReducer: setGuesses,
  addBulkServerDataEndpoint: guessesApiSlice.endpoints.addBulkGuesses,
  bulkAddIdbDataFn: bulkAddIdbGuesses,
  bulkDeleteIdbDataFn: bulkDeleteIdbGuesses,
  syncUuidFn: syncGuessUuids,
});

export const setGuessesFromIdbThunk = createSetDataFromIdbThunk<TGuess, Uuid>({
  modelDisplayName,
  actionType: "guesses/setGuessesFromIdbThunk",
  getIdbDataFn: getIdbAttemptGuesses,
  validationFn: Array.isArray,
  setDataReducer: setGuesses,
});

export const selectGuesses = (state: RootState) => state.guesses.data;

export const selectGuessWords = createSelector([selectGuesses], (guesses) =>
  guesses.map((guess) => guess.text),
);

export const selectSpoiledWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isSpoiled).map((guess) => guess.text),
);

export default guessesSlice.reducer;
