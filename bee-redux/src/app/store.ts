import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import puzzleReducer from "../features/puzzle/puzzleSlice";
import guessesReducer from "../features/guesses/guessesSlice";
import wordListSettingsReducer from "@/features/wordLists/wordListSettingsSlice";
import hintProfilesReducer from "../features/hints/hintProfilesSlice";
import { apiSlice } from "@/features/api/apiSlice";
import { listenerMiddleware } from "@/app/listenerMiddleware";

const rootReducer = combineReducers({
  auth: authReducer,
  puzzle: puzzleReducer,
  guesses: guessesReducer,
  wordListSettings: wordListSettingsReducer,
  hintProfiles: hintProfilesReducer,
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
