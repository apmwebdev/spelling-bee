import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import counterReducer from "../features/counter/counterSlice";
import puzzleReducer from "../features/puzzle/puzzleSlice";
import guessesReducer from "../features/guesses/guessesSlice";
import wordListSettingsReducer from "../features/guesses/./wordList/wordListSettingsSlice";
import hintProfilesReducer from "../features/hints/hintProfilesSlice";
import { apiSlice } from "@/features/api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    puzzle: puzzleReducer,
    guesses: guessesReducer,
    wordListSettings: wordListSettingsReducer,
    hintProfiles: hintProfilesReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
