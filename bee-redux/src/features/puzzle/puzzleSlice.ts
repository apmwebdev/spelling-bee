import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { fetchPuzzle } from "./puzzleAPI"
import { RootState } from "../../app/store"
import { calculateScore } from "../../utils/utils"
import { sortBy } from "lodash"

export interface AnswerFormat {
  word: string
  frequency: number
  definitions: string[]
}

export interface PuzzleFormat {
  date: string
  centerLetter: string
  outerLetters: string[]
  validLetters: string[]
  pangrams: string[]
  perfectPangrams: string[]
  answers: AnswerFormat[]
}

export const BlankPuzzle: PuzzleFormat = {
  date: "01-01-1600",
  centerLetter: "_",
  outerLetters: ["_", "_", "_", "_", "_", "_"],
  validLetters: ["_", "_", "_", "_", "_", "_", "_"],
  pangrams: [],
  perfectPangrams: [],
  answers: [],
}

export enum Statuses {
  Initial = "Not Fetched",
  Pending = "Loading...",
  Succeeded = "Up To Date",
  Failed = "Error",
}

export interface PuzzleState {
  data: PuzzleFormat
  status: Statuses
  error: string | null
}

const initialState: PuzzleState = {
  data: BlankPuzzle,
  status: Statuses.Initial,
  error: null,
}

export const fetchPuzzleAsync = createAsyncThunk(
  "puzzle/fetchPuzzle",
  async (identifier: string) => {
    const response = await fetchPuzzle(identifier)
    return response
  },
)

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuzzleAsync.pending, (state) => {
        state.status = Statuses.Pending
      })
      .addCase(fetchPuzzleAsync.fulfilled, (state, action) => {
        state.status = Statuses.Succeeded
        if (!action.payload.error) {
          state.data = action.payload
        }
      })
      .addCase(fetchPuzzleAsync.rejected, (state, action) => {
        state.status = Statuses.Failed
        if (action.error.message) {
          state.error = action.error.message
        }
      })
  },
})

export const {} = puzzleSlice.actions

export const selectPuzzle = (state: RootState) => state.puzzle.data
export const selectDate = (state: RootState) => state.puzzle.data.date
export const selectCenterLetter = (state: RootState) =>
  state.puzzle.data.centerLetter
export const selectOuterLetters = (state: RootState) =>
  state.puzzle.data.outerLetters
export const selectValidLetters = (state: RootState) =>
  state.puzzle.data.validLetters
export const selectPangrams = (state: RootState) => state.puzzle.data.pangrams
export const selectPerfectPangrams = (state: RootState) =>
  state.puzzle.data.perfectPangrams
export const selectAnswers = (state: RootState) => state.puzzle.data.answers

// Derived data
export const selectAnswerWords = createSelector([selectAnswers], (answers) =>
  answers.map((answer) => answer.word),
)

export const selectTotalPoints = createSelector(
  [selectAnswerWords],
  (answerWords) => calculateScore(answerWords),
)

export const selectAnswerLengths = createSelector(
  [selectAnswerWords],
  (answerWords) => {
    const answerLengths: number[] = []
    for (const answer of answerWords) {
      if (!answerLengths.includes(answer.length)) {
        answerLengths.push(answer.length)
      }
    }
    return sortBy(answerLengths)
  },
)

export default puzzleSlice.reducer
