import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { SortOrderKeys, Statuses } from "@/types";

export enum SortType {
  Alphabetical = "alphabetical",
  FoundOrder = "foundOrder",
}

export type FoundWordsSettingsFormat = {
  sortType: SortType;
  sortOrder: SortOrderKeys;
  letterFilter: string[];
  wordsShowTotal: boolean;
  pangramsShowTotal: boolean;
  showPerfectPangrams: boolean;
  perfectPangramsShowTotal: boolean;
  settingsCollapsed: boolean;
};

export type WrongGuessesSettingsFormat = {
  sortType: SortType;
  sortOrder: SortOrderKeys;
  letterFilter: string[];
  settingsCollapsed: boolean;
};

export type ExcludedWordsSettingsFormat = {
  sortOrder: SortOrderKeys;
  letterFilter: string[];
  settingsCollapsed: boolean;
};

export type AnswerListSettingsFormat = {
  sortOrder: SortOrderKeys;
  letterFilter: string[];
  remainingAndSpoiledOnly: boolean;
  remainingRevealFirstLetter: boolean;
  remainingRevealLength: boolean;
  remainingLocation: "beginning" | "end";
  remainingGroupWithLetter: boolean;
  settingsCollapsed: boolean;
};

export type WordListSettingsFormat = {
  foundWords: FoundWordsSettingsFormat;
  wrongGuesses: WrongGuessesSettingsFormat;
  excludedWords: ExcludedWordsSettingsFormat;
  answers: AnswerListSettingsFormat;
  general: {
    groupByFirstLetter: boolean;
  };
};

export type WordListSettingsState = {
  data: WordListSettingsFormat;
  status: Statuses;
};

const initialState: WordListSettingsState = {
  data: {
    foundWords: {
      sortType: SortType.Alphabetical,
      sortOrder: SortOrderKeys.asc,
      letterFilter: [],
      wordsShowTotal: true,
      pangramsShowTotal: true,
      showPerfectPangrams: true,
      perfectPangramsShowTotal: true,
      settingsCollapsed: true,
    },
    wrongGuesses: {
      sortType: SortType.FoundOrder,
      sortOrder: SortOrderKeys.desc,
      letterFilter: [],
      settingsCollapsed: true,
    },
    excludedWords: {
      sortOrder: SortOrderKeys.asc,
      letterFilter: [],
      settingsCollapsed: true,
    },
    answers: {
      sortOrder: SortOrderKeys.asc,
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
  status: Statuses.Initial,
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
