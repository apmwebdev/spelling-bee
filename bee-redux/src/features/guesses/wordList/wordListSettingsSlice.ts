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

export interface FoundWordsSettingsFormat {
  foundWordsSortType: SortType;
  foundWordsSortOrder: SortOrder;
  foundWordsLetterFilter: string[];
  foundWordsIncludeTotal: boolean;
  pangramsIncludeTotal: boolean;
  includePerfectPangrams: boolean;
  perfectPangramsIncludeTotal: boolean;
  foundSettingsCollapsed: boolean;
}

export interface WrongGuessesSettingsFormat {
  wrongGuessesSortType: SortType;
  wrongGuessesSortOrder: SortOrder;
  wrongGuessesLetterFilter: string[];
  wrongGuessesSettingsCollapsed: boolean;
}

export interface ExcludedWordsSettingsFormat {
  sortOrder: SortOrder;
  letterFilter: string[];
  settingsCollapsed: boolean;
}

export interface AnswerListSettingsFormat {
  answerListSortOrder: SortOrder;
  answerListRemainingOnly: boolean;
  answerListRevealAll: boolean;
  answerListLetterFilter: string[];
}

export interface WordListSettingsFormat {
  foundWords: FoundWordsSettingsFormat;
  wrongGuesses: WrongGuessesSettingsFormat;
  excludedWords: ExcludedWordsSettingsFormat;
  answers: AnswerListSettingsFormat;
  general: {
    groupByFirstLetter: boolean;
  };
}

export interface WordListSettingsState {
  data: WordListSettingsFormat;
  status: Status;
}

const initialState: WordListSettingsState = {
  data: {
    foundWords: {
      foundWordsSortType: SortType.Alphabetical,
      foundWordsSortOrder: SortOrder.Ascending,
      foundWordsLetterFilter: [],
      foundWordsIncludeTotal: true,
      pangramsIncludeTotal: true,
      includePerfectPangrams: true,
      perfectPangramsIncludeTotal: true,
      foundSettingsCollapsed: true,
    },
    wrongGuesses: {
      wrongGuessesSortType: SortType.FoundOrder,
      wrongGuessesSortOrder: SortOrder.Descending,
      wrongGuessesLetterFilter: [],
      wrongGuessesSettingsCollapsed: true,
    },
    excludedWords: {
      sortOrder: SortOrder.Ascending,
      letterFilter: [],
      settingsCollapsed: true,
    },
    answers: {
      answerListSortOrder: SortOrder.Ascending,
      answerListRemainingOnly: true,
      answerListRevealAll: false,
      answerListLetterFilter: [],
    },
    general: {
      groupByFirstLetter: true,
    },
  },
  status: Status.Initial,
};

export const wordListSettingsSlice = createSlice({
  name: "wordListSettings",
  initialState,
  reducers: {
    setFoundWordsSortType: (state, action) => {
      state.data.foundWords.foundWordsSortType = action.payload;
    },
    setFoundWordsSortOrder: (state, action) => {
      state.data.foundWords.foundWordsSortOrder = action.payload;
    },
    // toggleWrongGuessesShow: (state) => {
    //   state.data.wrongGuessesShow = !state.data.wrongGuessesShow;
    // },
    // toggleWrongGuessesSeparate: (state) => {
    //   state.data.wrongGuessesSeparate = !state.data.wrongGuessesSeparate;
    // },
    setFoundWordsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.foundWordsIncludeTotal = action.payload;
    },
    setPangramsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.pangramsIncludeTotal = action.payload;
    },
    setIncludePerfectPangrams: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.includePerfectPangrams = action.payload;
    },
    setPerfectPangramsIncludeTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.perfectPangramsIncludeTotal = action.payload;
    },
    toggleFoundSettingsCollapsed: (state) => {
      state.data.foundWords.foundSettingsCollapsed =
        !state.data.foundWords.foundSettingsCollapsed;
    },
    setWrongGuessesSortType: (state, action) => {
      state.data.wrongGuesses.wrongGuessesSortType = action.payload;
    },
    setWrongGuessesSortOrder: (state, action) => {
      state.data.wrongGuesses.wrongGuessesSortOrder = action.payload;
    },
    toggleWrongGuessesSettingsCollapsed: (state) => {
      state.data.wrongGuesses.wrongGuessesSettingsCollapsed =
        !state.data.wrongGuesses.wrongGuessesSettingsCollapsed;
    },
    setExcludedWordsSortOrder: (state, action) => {
      state.data.excludedWords.sortOrder = action.payload;
    },
    toggleExcludedWordsSettingsCollapsed: (state) => {
      state.data.excludedWords.settingsCollapsed =
        !state.data.excludedWords.settingsCollapsed;
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
  setWrongGuessesSortType,
  setWrongGuessesSortOrder,
  toggleWrongGuessesSettingsCollapsed,
  setExcludedWordsSortOrder,
  toggleExcludedWordsSettingsCollapsed,
} = wordListSettingsSlice.actions;

export const selectWordListSettings = (state: RootState) =>
  state.wordListSettings.data;
export const selectFoundWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.foundWords;
export const selectWordListFoundSettingsCollapsed = (state: RootState) =>
  state.wordListSettings.data.foundWords.foundSettingsCollapsed;
export const selectWrongGuessesListSettings = (state: RootState) =>
  state.wordListSettings.data.wrongGuesses;
export const selectExcludedWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.excludedWords;

export default wordListSettingsSlice.reducer;
