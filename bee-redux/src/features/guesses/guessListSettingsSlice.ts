import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export enum SortType {
  Alphabetical = "alphabetical",
  FoundOrder = "foundOrder",
}

export enum SortOrder {
  Ascending = "ascending",
  Descending = "descending",
}

export interface GuessListSettingsFormat {
  sortType: SortType
  sortOrder: SortOrder
  showWrongGuesses: boolean
  separateWrongGuesses: boolean
  isCollapsed: boolean
}

export interface GuessListSettingsState {
  data: GuessListSettingsFormat
  status: Status
}

const initialState: GuessListSettingsState = {
  data: {
    sortType: SortType.Alphabetical,
    sortOrder: SortOrder.Ascending,
    showWrongGuesses: false,
    separateWrongGuesses: false,
    isCollapsed: true,
  },
  status: Status.Initial,
}

export const guessListSettingsSlice = createSlice({
  name: "guessListSettings",
  initialState,
  reducers: {
    setSortType: (state, action) => {
      state.data.sortType = action.payload
    },
    setSortOrder: (state, action) => {
      state.data.sortOrder = action.payload
    },
    toggleShowWrongGuesses: (state) => {
      state.data.showWrongGuesses = !state.data.showWrongGuesses
    },
    toggleSeparateWrongGuesses: (state) => {
      state.data.separateWrongGuesses = !state.data.separateWrongGuesses
    },
    toggleIsCollapsed: (state) => {
      state.data.isCollapsed = !state.data.isCollapsed
    },
  },
  extraReducers: (builder) => {},
})

export const {
  setSortType,
  setSortOrder,
  toggleShowWrongGuesses,
  toggleSeparateWrongGuesses,
  toggleIsCollapsed,
} = guessListSettingsSlice.actions

export const selectGuessListSettings = (state: RootState) =>
  state.guessListSettings.data
export const selectGuessListShowWrongGuesses = (state: RootState) =>
  state.guessListSettings.data.showWrongGuesses

export default guessListSettingsSlice.reducer
