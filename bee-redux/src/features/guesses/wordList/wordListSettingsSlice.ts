import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

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

export interface WordListSettingsFormat {
  //Found Words
  foundWordsSortType: SortType;
  foundWordsSortOrder: SortOrder;
  foundWordsFilter: string[];
  //Wrong Guesses
  wrongGuessesSortType: SortType;
  wrongGuessesSortOrder: SortOrder;
  wrongGuessesFilter: string[];
  //Excluded Words
  excludedWordsSortOrder: SortOrder;
  excludedWordsFilter: string[];
  //Answer Tab
  answerTabSortOrder: SortOrder;
  answerTabRemainingOnly: boolean;
  answerTabRevealAll: boolean;
  answerTabFilter: string[];
  //General
  groupByFirstLetter: boolean;
  //Status Box
  foundWordsIncludeTotal: boolean;
  pangramsIncludeTotal: boolean;
  includePerfectPangrams: boolean;
  perfectPangramsIncludeTotal: boolean;
  //State
  settingsCollapsed: boolean;
}

export interface WordListSettingsState {
  data: WordListSettingsFormat;
  status: Status;
}

const initialState: WordListSettingsState = {
  data: {
    foundWordsSortType: SortType.Alphabetical,
    foundWordsSortOrder: SortOrder.Ascending,
    foundWordsFilter: [],
    wrongGuessesSortType: SortType.FoundOrder,
    wrongGuessesSortOrder: SortOrder.Descending,
    wrongGuessesFilter: [],
    excludedWordsSortOrder: SortOrder.Ascending,
    excludedWordsFilter: [],
    answerTabSortOrder: SortOrder.Ascending,
    answerTabRemainingOnly: true,
    answerTabRevealAll: false,
    answerTabFilter: [],
    groupByFirstLetter: true,
    foundWordsIncludeTotal: true,
    pangramsIncludeTotal: true,
    includePerfectPangrams: true,
    perfectPangramsIncludeTotal: true,
    settingsCollapsed: true,
  },
  status: Status.Initial,
};

export const wordListSettingsSlice = createSlice({
  name: "wordListSettings",
  initialState,
  reducers: {
    setFoundWordsSortType: (state, action) => {
      state.data.foundWordsSortType = action.payload;
    },
    setFoundWordsSortOrder: (state, action) => {
      state.data.foundWordsSortOrder = action.payload;
    },
    // toggleWrongGuessesShow: (state) => {
    //   state.data.wrongGuessesShow = !state.data.wrongGuessesShow;
    // },
    // toggleWrongGuessesSeparate: (state) => {
    //   state.data.wrongGuessesSeparate = !state.data.wrongGuessesSeparate;
    // },
    toggleSettingsCollapsed: (state) => {
      state.data.settingsCollapsed = !state.data.settingsCollapsed;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setFoundWordsSortType,
  setFoundWordsSortOrder,
  // toggleWrongGuessesShow,
  // toggleWrongGuessesSeparate,
  toggleSettingsCollapsed,
} = wordListSettingsSlice.actions;

export const selectWordListSettings = (state: RootState) =>
  state.wordListSettings.data;
export const selectWordListSettingsCollapsed = (state: RootState) =>
  state.wordListSettings.data.settingsCollapsed;

export default wordListSettingsSlice.reducer;
