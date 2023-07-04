import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import puzzleReducer from "../features/puzzle/puzzleSlice"
import guessesReducer from "../features/guesses/guessesSlice"
import guessListSettingsReducer from "../features/guesses/guessListSettingsSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    puzzle: puzzleReducer,
    guesses: guessesReducer,
    guessListSettings: guessListSettingsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
