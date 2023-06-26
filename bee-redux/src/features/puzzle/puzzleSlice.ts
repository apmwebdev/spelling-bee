import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PuzzleFormat, fetchPuzzle } from "./puzzleAPI"
import { RootState } from "../../app/store"

export interface PuzzleState {
  data: PuzzleFormat | null | undefined
  status: "idle" | "loading" | "failed"
}

const initialState: PuzzleState = {
  data: null,
  status: "idle",
}

export const fetchAsync = createAsyncThunk(
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
      .addCase(fetchAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        state.status = "idle"
        state.data = action.payload
      })
      .addCase(fetchAsync.rejected, (state) => {
        state.status = "failed"
      })
  },
})

export const {} = puzzleSlice.actions

export const selectPuzzle = (state: RootState) => state.puzzle.data

export default puzzleSlice.reducer
