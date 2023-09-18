import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

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
  sortType: SortType;
  sortOrder: SortOrder;
  letterFilter: string[];
  wordsShowTotal: boolean;
  pangramsShowTotal: boolean;
  showPerfectPangrams: boolean;
  perfectPangramsShowTotal: boolean;
  settingsCollapsed: boolean;
}

export interface WrongGuessesSettingsFormat {
  sortType: SortType;
  sortOrder: SortOrder;
  letterFilter: string[];
  settingsCollapsed: boolean;
}

export interface ExcludedWordsSettingsFormat {
  sortOrder: SortOrder;
  letterFilter: string[];
  settingsCollapsed: boolean;
}

export interface AnswerListSettingsFormat {
  sortOrder: SortOrder;
  letterFilter: string[];
  remainingAndSpoiledOnly: boolean;
  remainingRevealFirstLetter: boolean;
  remainingRevealLength: boolean;
  remainingLocation: "beginning" | "end";
  remainingGroupWithLetter: boolean;
  settingsCollapsed: boolean;
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
      sortType: SortType.Alphabetical,
      sortOrder: SortOrder.Ascending,
      letterFilter: [],
      wordsShowTotal: true,
      pangramsShowTotal: true,
      showPerfectPangrams: true,
      perfectPangramsShowTotal: true,
      settingsCollapsed: true,
    },
    wrongGuesses: {
      sortType: SortType.FoundOrder,
      sortOrder: SortOrder.Descending,
      letterFilter: [],
      settingsCollapsed: true,
    },
    excludedWords: {
      sortOrder: SortOrder.Ascending,
      letterFilter: [],
      settingsCollapsed: true,
    },
    answers: {
      sortOrder: SortOrder.Ascending,
      letterFilter: [],
      remainingAndSpoiledOnly: false,
      remainingRevealFirstLetter: true,
      remainingRevealLength: true,
      remainingLocation: "beginning",
      remainingGroupWithLetter: true,
      settingsCollapsed: true,
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
      state.data.foundWords.sortType = action.payload;
    },
    setFoundWordsSortOrder: (state, action) => {
      state.data.foundWords.sortOrder = action.payload;
    },
    setFoundWordsWordsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.wordsShowTotal = action.payload;
    },
    setFoundWordsPangramsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.pangramsShowTotal = action.payload;
    },
    setFoundWordsShowPerfectPangrams: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.showPerfectPangrams = action.payload;
    },
    setFoundWordsPerfectPangramsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.foundWords.perfectPangramsShowTotal = action.payload;
    },
    toggleFoundWordsSettingsCollapsed: (state) => {
      state.data.foundWords.settingsCollapsed =
        !state.data.foundWords.settingsCollapsed;
    },
    setWrongGuessesSortType: (state, action) => {
      state.data.wrongGuesses.sortType = action.payload;
    },
    setWrongGuessesSortOrder: (state, action) => {
      state.data.wrongGuesses.sortOrder = action.payload;
    },
    toggleWrongGuessesSettingsCollapsed: (state) => {
      state.data.wrongGuesses.settingsCollapsed =
        !state.data.wrongGuesses.settingsCollapsed;
    },
    setExcludedWordsSortOrder: (state, action) => {
      state.data.excludedWords.sortOrder = action.payload;
    },
    toggleExcludedWordsSettingsCollapsed: (state) => {
      state.data.excludedWords.settingsCollapsed =
        !state.data.excludedWords.settingsCollapsed;
    },
    setAnswersSortOrder: (state, action) => {
      state.data.answers.sortOrder = action.payload;
    },
    setAnswersRemainingAndSpoiledOnly: (state, action) => {
      state.data.answers.remainingAndSpoiledOnly = action.payload;
    },
    setAnswersRemainingRevealFirstLetter: (state, action) => {
      state.data.answers.remainingRevealFirstLetter = action.payload;
    },
    setAnswersRemainingRevealLength: (state, action) => {
      state.data.answers.remainingRevealLength = action.payload;
    },
    setAnswersRemainingLocation: (state, action) => {
      state.data.answers.remainingLocation = action.payload;
    },
    setAnswersRemainingGroupWithLetter: (state, action) => {
      state.data.answers.remainingGroupWithLetter = action.payload;
    },
    toggleAnswersSettingsCollapsed: (state) => {
      console.log("trigger");
      state.data.answers.settingsCollapsed =
        !state.data.answers.settingsCollapsed;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setFoundWordsSortType,
  setFoundWordsSortOrder,
  setFoundWordsWordsShowTotal,
  setFoundWordsPangramsShowTotal,
  setFoundWordsShowPerfectPangrams,
  setFoundWordsPerfectPangramsShowTotal,
  toggleFoundWordsSettingsCollapsed,
  setWrongGuessesSortType,
  setWrongGuessesSortOrder,
  toggleWrongGuessesSettingsCollapsed,
  setExcludedWordsSortOrder,
  toggleExcludedWordsSettingsCollapsed,
  setAnswersSortOrder,
  setAnswersRemainingAndSpoiledOnly,
  setAnswersRemainingRevealFirstLetter,
  setAnswersRemainingRevealLength,
  setAnswersRemainingLocation,
  setAnswersRemainingGroupWithLetter,
  toggleAnswersSettingsCollapsed,
} = wordListSettingsSlice.actions;

export const selectFoundWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.foundWords;
export const selectWrongGuessesListSettings = (state: RootState) =>
  state.wordListSettings.data.wrongGuesses;
export const selectExcludedWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.excludedWords;
export const selectAnswersListSettings = (state: RootState) =>
  state.wordListSettings.data.answers;

export default wordListSettingsSlice.reducer;
