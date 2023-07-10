import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit"
import { fetchPuzzle } from "./puzzleAPI"
import { RootState } from "../../app/store"
import { calculateScore } from "../../utils/utils"

export interface PuzzleFormat {
  printDate: string
  centerLetter: string
  outerLetters: string[]
  validLetters: string[]
  pangrams: string[]
  perfectPangrams: string[]
  answers: string[]
}

export const BlankPuzzle: PuzzleFormat = {
  printDate: "01-01-1600",
  centerLetter: "B",
  outerLetters: ["C", "D", "F", "G", "H", "J"],
  validLetters: ["B", "C", "D", "F", "G", "H", "J"],
  pangrams: [],
  perfectPangrams: [],
  answers: [],
}

export interface PuzzleState {
  data: PuzzleFormat
  status: "idle" | "loading" | "failed"
}

const initialState: PuzzleState = {
  data: BlankPuzzle,
  status: "idle",
}

export const fetchPuzzleAsync = createAsyncThunk(
  "puzzle/fetchPuzzle",
  async (dateString: string) => {
    const response = await fetchPuzzle(dateString)
    return response.data
  },
)

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuzzleAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPuzzleAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.data = action.payload
      })
      .addCase(fetchPuzzleAsync.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const {} = puzzleSlice.actions

export const selectPuzzle = (state: RootState) => state.puzzle.data
export const selectPrintDate = (state: RootState) => state.puzzle.data.printDate
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
export const selectTotalPoints = (state: RootState) =>
  calculateScore(state.puzzle.data.answers)
export const selectAnswerLengths = createSelector(
  [selectAnswers],
  (answers) => {
    const answerLengths: number[] = []
    for (const answer of answers) {
      if (!answerLengths.includes(answer.length)) {
        answerLengths.push(answer.length)
      }
    }
    return answerLengths.sort()
  },
)

export default puzzleSlice.reducer
