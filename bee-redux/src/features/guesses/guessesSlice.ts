import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchGuesses, guessesSampleData } from './guessesAPI';
import { RootState } from "../../app/store"

export enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export interface GuessFormat {
  word: string
  timestamp: number
}

export interface GuessesFormat {
  userId: number
  puzzleId: string
  guesses: GuessFormat[]
}

export interface GuessesState {
  data: GuessesFormat | null | undefined
  status: Status
}

const initialState: GuessesState = {
  data: guessesSampleData[0],
  status: Status.Initial,
}

export const fetchGuessesAsync = createAsyncThunk(
  "guesses/fetchGuesses",
  async (puzzleId: string) => {
    const response = await fetchGuesses(0, puzzleId)
    return response.data
  },
)

const createGuessObject = (word: string): GuessFormat => {
  return {
    word: word,
    timestamp: Date.now(),
  }
}

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    addGuess: (state, action) => {
      if (!state.data) {
        //create state object
      } else {
        state.data.guesses.push(createGuessObject(action.payload))
      }
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

export const selectGuesses = (state: RootState) => state.guesses.data

export default guessesSlice.reducer
