import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchPuzzle } from "./puzzleAPI"
import { RootState } from "../../app/store"

export interface PuzzleFormat {
  printDate: string
  centerLetter: string
  outerLetters: string[]
  validLetters: string[]
  pangrams: string[]
  answers: string[]
}

export interface PuzzleState {
  data: PuzzleFormat | null | undefined
  status: "idle" | "loading" | "failed"
}

const initialState: PuzzleState = {
  data: null,
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
export const selectPrintDate = (state: RootState) =>
  state.puzzle.data?.printDate
export const selectCenterLetter = (state: RootState) =>
  state.puzzle.data?.centerLetter
export const selectOuterLetters = (state: RootState) =>
  state.puzzle.data?.outerLetters
export const selectValidLetters = (state: RootState) =>
  state.puzzle.data?.validLetters
export const selectPangrams = (state: RootState) => state.puzzle.data?.pangrams
export const selectAnswers = (state: RootState) => state.puzzle.data?.answers

export default puzzleSlice.reducer
