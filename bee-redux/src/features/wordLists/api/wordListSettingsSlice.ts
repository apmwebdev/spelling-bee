/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { SortOrderKeys, Statuses } from "@/types/globalTypes";

export enum SortType {
  Alphabetical = "alphabetical",
  FoundOrder = "foundOrder",
}

export type KnownWordsSettingsFormat = {
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
  sortType: SortType.Alphabetical;
  sortOrder: SortOrderKeys;
  letterFilter: string[];
  settingsCollapsed: boolean;
};

export type AnswerListSettingsFormat = {
  sortType: SortType.Alphabetical;
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
  knownWords: KnownWordsSettingsFormat;
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
    knownWords: {
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
      sortType: SortType.Alphabetical,
      sortOrder: SortOrderKeys.asc,
      letterFilter: [],
      settingsCollapsed: true,
    },
    answers: {
      sortType: SortType.Alphabetical,
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
    setKnownWordsSortType: (state, action) => {
      state.data.knownWords.sortType = action.payload;
    },
    setKnownWordsSortOrder: (state, action) => {
      state.data.knownWords.sortOrder = action.payload;
    },
    setKnownWordsWordsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.knownWords.wordsShowTotal = action.payload;
    },
    setKnownWordsPangramsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.knownWords.pangramsShowTotal = action.payload;
    },
    setKnownWordsShowPerfectPangrams: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.knownWords.showPerfectPangrams = action.payload;
    },
    setKnownWordsPerfectPangramsShowTotal: (
      state,
      action: { payload: boolean; type: string },
    ) => {
      state.data.knownWords.perfectPangramsShowTotal = action.payload;
    },
    toggleKnownWordsSettingsCollapsed: (state) => {
      state.data.knownWords.settingsCollapsed =
        !state.data.knownWords.settingsCollapsed;
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
      state.data.answers.settingsCollapsed =
        !state.data.answers.settingsCollapsed;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setKnownWordsSortType,
  setKnownWordsSortOrder,
  setKnownWordsWordsShowTotal,
  setKnownWordsPangramsShowTotal,
  setKnownWordsShowPerfectPangrams,
  setKnownWordsPerfectPangramsShowTotal,
  toggleKnownWordsSettingsCollapsed,
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

export const selectKnownWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.knownWords;
export const selectWrongGuessesListSettings = (state: RootState) =>
  state.wordListSettings.data.wrongGuesses;
export const selectExcludedWordsListSettings = (state: RootState) =>
  state.wordListSettings.data.excludedWords;
export const selectAnswersListSettings = (state: RootState) =>
  state.wordListSettings.data.answers;

export default wordListSettingsSlice.reducer;
