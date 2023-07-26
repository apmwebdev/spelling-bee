import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { TrackingOptions } from "../../hints/hintProfilesSlice";

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
  //Found Words
  foundWordsSortType: SortType;
  foundWordsSortOrder: SortOrder;
  foundWordsFilter: string[];
  //Wrong Guesses
  wrongGuessesShow: boolean;
  wrongGuessesSeparate: boolean;
  wrongGuessesSortType: SortType;
  wrongGuessesSortOrder: SortOrder;
  wrongGuessesFilter: string[];
  //Excluded Words
  excludedWordsShow: boolean;
  excludedWordsSeparate: boolean;
  excludedWordsSortOrder: SortOrder;
  excludedWordsFilter: string[];
  //Answer Tab
  answerTabShow: boolean;
  answerTabSortOrder: SortOrder;
  answerTabRemainingOnly: boolean;
  answerTabRevealAll: boolean;
  answerTabFilter: string[];
  //General
  groupByFirstLetter: boolean;
  //Status Box
  foundWordsTracking: TrackingOptions;
  pointsTracking: TrackingOptions;
  pangramsTracking: TrackingOptions;
  showPerfectPangrams: boolean;
  //State
  settingsCollapsed: boolean;
}

export interface GuessListSettingsState {
  data: GuessListSettingsFormat;
  status: Status;
}

const initialState: GuessListSettingsState = {
  data: {
    foundWordsSortType: SortType.Alphabetical,
    foundWordsSortOrder: SortOrder.Ascending,
    foundWordsFilter: [],
    wrongGuessesShow: true,
    wrongGuessesSeparate: true,
    wrongGuessesSortType: SortType.FoundOrder,
    wrongGuessesSortOrder: SortOrder.Descending,
    wrongGuessesFilter: [],
    excludedWordsShow: true,
    excludedWordsSeparate: true,
    excludedWordsSortOrder: SortOrder.Ascending,
    excludedWordsFilter: [],
    answerTabShow: true,
    answerTabSortOrder: SortOrder.Ascending,
    answerTabRemainingOnly: true,
    answerTabRevealAll: false,
    answerTabFilter: [],
    groupByFirstLetter: true,
    foundWordsTracking: TrackingOptions.FoundOfTotal,
    pointsTracking: TrackingOptions.FoundOfTotal,
    pangramsTracking: TrackingOptions.FoundOfTotal,
    showPerfectPangrams: true,
    settingsCollapsed: true,
  },
  status: Status.Initial,
};

export const guessListSettingsSlice = createSlice({
  name: "guessListSettings",
  initialState,
  reducers: {
    setFoundWordsSortType: (state, action) => {
      state.data.foundWordsSortType = action.payload;
    },
    setFoundWordsSortOrder: (state, action) => {
      state.data.foundWordsSortOrder = action.payload;
    },
    toggleWrongGuessesShow: (state) => {
      state.data.wrongGuessesShow = !state.data.wrongGuessesShow;
    },
    toggleWrongGuessesSeparate: (state) => {
      state.data.wrongGuessesSeparate = !state.data.wrongGuessesSeparate;
    },
    toggleSettingsCollapsed: (state) => {
      state.data.settingsCollapsed = !state.data.settingsCollapsed;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setFoundWordsSortType,
  setFoundWordsSortOrder,
  toggleWrongGuessesShow,
  toggleWrongGuessesSeparate,
  toggleSettingsCollapsed,
} = guessListSettingsSlice.actions;

export const selectGuessListSettings = (state: RootState) =>
  state.guessListSettings.data;
export const selectGuessListSettingsCollapsed = (state: RootState) =>
  state.guessListSettings.data.settingsCollapsed;

export default guessListSettingsSlice.reducer;
