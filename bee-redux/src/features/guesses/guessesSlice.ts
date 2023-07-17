import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { fetchGuesses, guessesSampleData } from './guessesAPI';
import { RootState } from "../../app/store"
import { calculateScore } from "../../utils/utils"

export enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export interface GuessFormData {
  word: string
  isAnswer: boolean
}

export interface GuessFormat {
  word: string
  timestamp: number
  isAnswer: boolean
}

export interface GuessesFormat {
  userId: number
  puzzleId: string
  guesses: GuessFormat[]
  // includes: Function
}

export interface GuessesState {
  data: GuessesFormat
  status: Status
}

const initialState: GuessesState = {
  data: { userId: 0, puzzleId: "a", guesses: [] },
  // data: guessesSampleData[0],
  status: Status.Initial,
}

export const fetchGuessesAsync = createAsyncThunk(
  "guesses/fetchGuesses",
  async (puzzleId: string) => {
    const response = await fetchGuesses(0, puzzleId)
    return response.data
  },
)

const createGuessObject = (guessData: GuessFormData): GuessFormat => {
  return {
    word: guessData.word,
    timestamp: Date.now(),
    isAnswer: guessData.isAnswer,
  }
}

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    addGuess: (state, action) => {
      state.data.guesses.push(createGuessObject(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuessesAsync.pending, (state) => {
        state.status = Status.Loading
      })
      .addCase(fetchGuessesAsync.fulfilled, (state, action) => {
        state.status = Status.UpToDate
        state.data = action.payload
      })
      .addCase(fetchGuessesAsync.rejected, (state) => {
        state.status = Status.Error
      })
  },
})

export const { addGuess } = guessesSlice.actions

export const selectGuessesData = (state: RootState) => state.guesses.data
export const selectGuesses = (state: RootState) => state.guesses.data.guesses
export const selectGuessWords = createSelector([selectGuesses], (guesses) =>
  guesses.map((guessObj) => guessObj.word),
)
export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer),
)
export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guessObjects) =>
    guessObjects
      .filter((guessObj) => guessObj.isAnswer)
      .map((guessObj) => guessObj.word),
)
export const selectScore = (state: RootState) => {
  const correctGuesses = state.guesses.data.guesses
    .filter((guessObject) => guessObject.isAnswer)
    .map((guessObject) => guessObject.word)
  return calculateScore(correctGuesses)
}

export default guessesSlice.reducer
