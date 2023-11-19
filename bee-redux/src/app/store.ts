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
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "@/features/auth/api/authSlice";
import puzzleReducer from "@/features/puzzle/api/puzzleSlice";
import guessesReducer from "@/features/guesses/api/guessesSlice";
import wordListSettingsReducer from "@/features/wordLists/api/wordListSettingsSlice";
import hintProfilesReducer from "@/features/hintProfiles/api/hintProfilesSlice";
import hintPanelsReducer from "@/features/hintPanels/api/hintPanelsSlice";
import searchPanelSearchesReducer from "@/features/searchPanelSearches/api/searchPanelSearchesSlice";
import { apiSlice } from "@/features/api/api/apiSlice";
import { listenerMiddleware } from "@/app/listenerMiddleware";

const rootReducer = combineReducers({
  auth: authReducer,
  puzzle: puzzleReducer,
  guesses: guessesReducer,
  wordListSettings: wordListSettingsReducer,
  hintProfiles: hintProfilesReducer,
  hintPanels: hintPanelsReducer,
  searchPanelSearches: searchPanelSearchesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
