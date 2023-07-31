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
  foundSettingsCollapsed: boolean;
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
    foundSettingsCollapsed: true,
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
    toggleFoundSettingsCollapsed: (state) => {
      state.data.foundSettingsCollapsed = !state.data.foundSettingsCollapsed;
    },
    setFoundWordsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWordsIncludeTotal = action.payload;
    },
    setPangramsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.pangramsIncludeTotal = action.payload;
    },
    setIncludePerfectPangrams: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.includePerfectPangrams = action.payload;
    },
    setPerfectPangramsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.perfectPangramsIncludeTotal = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setFoundWordsSortType,
  setFoundWordsSortOrder,
  // toggleWrongGuessesShow,
  // toggleWrongGuessesSeparate,
  toggleFoundSettingsCollapsed,
  setFoundWordsIncludeTotal,
  setPangramsIncludeTotal,
  setIncludePerfectPangrams,
  setPerfectPangramsIncludeTotal,
} = wordListSettingsSlice.actions;

export const selectWordListSettings = (state: RootState) =>
  state.wordListSettings.data;
export const selectWordListFoundSettingsCollapsed = (state: RootState) =>
  state.wordListSettings.data.foundSettingsCollapsed;

export default wordListSettingsSlice.reducer;
