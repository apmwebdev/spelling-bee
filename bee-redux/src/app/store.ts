import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import counterReducer from "../features/counter/counterSlice"
import puzzleReducer from "../features/puzzle/puzzleSlice"
import guessesReducer from "../features/guesses/guessesSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    puzzle: puzzleReducer,
    guesses: guessesReducer,
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
