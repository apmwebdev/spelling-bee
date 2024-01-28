/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { createInitialState, SortOrderKeys } from "@/types/globalTypes";
import {
  RemainingAnswersLocations,
  SortType,
  WordListSettingsFormat,
} from "@/features/wordLists/types/wordListTypes";

const initialState = createInitialState<WordListSettingsFormat>({
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
    remainingLocation: RemainingAnswersLocations.beginning,
    remainingGroupWithFirstLetter: true,
    settingsCollapsed: true,
  },
  general: {
    groupByFirstLetter: true,
  },
});

export const wordListSettingsSlice = createSlice({
  name: "wordListSettings",
  initialState,
  reducers: {
    setKnownWordsSortType: (state, { payload }: PayloadAction<SortType>) => {
      state.data.knownWords.sortType = payload;
    },
    setKnownWordsSortOrder: (
      state,
      { payload }: PayloadAction<SortOrderKeys>,
    ) => {
      state.data.knownWords.sortOrder = payload;
    },
    setKnownWordsWordsShowTotal: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.knownWords.wordsShowTotal = payload;
    },
    setKnownWordsPangramsShowTotal: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.knownWords.pangramsShowTotal = payload;
    },
    setKnownWordsShowPerfectPangrams: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.knownWords.showPerfectPangrams = payload;
    },
    setKnownWordsPerfectPangramsShowTotal: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.knownWords.perfectPangramsShowTotal = payload;
    },
    toggleKnownWordsSettingsCollapsed: (state) => {
      state.data.knownWords.settingsCollapsed =
        !state.data.knownWords.settingsCollapsed;
    },
    setWrongGuessesSortType: (state, { payload }: PayloadAction<SortType>) => {
      state.data.wrongGuesses.sortType = payload;
    },
    setWrongGuessesSortOrder: (
      state,
      { payload }: PayloadAction<SortOrderKeys>,
    ) => {
      state.data.wrongGuesses.sortOrder = payload;
    },
    toggleWrongGuessesSettingsCollapsed: (state) => {
      state.data.wrongGuesses.settingsCollapsed =
        !state.data.wrongGuesses.settingsCollapsed;
    },
    setExcludedWordsSortOrder: (
      state,
      { payload }: PayloadAction<SortOrderKeys>,
    ) => {
      state.data.excludedWords.sortOrder = payload;
    },
    toggleExcludedWordsSettingsCollapsed: (state) => {
      state.data.excludedWords.settingsCollapsed =
        !state.data.excludedWords.settingsCollapsed;
    },
    setAnswersSortOrder: (state, { payload }: PayloadAction<SortOrderKeys>) => {
      state.data.answers.sortOrder = payload;
    },
    setAnswersRemainingAndSpoiledOnly: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.answers.remainingAndSpoiledOnly = payload;
    },
    setAnswersRemainingRevealFirstLetter: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.answers.remainingRevealFirstLetter = payload;
    },
    setAnswersRemainingRevealLength: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.answers.remainingRevealLength = payload;
    },
    setAnswersRemainingGroupWithLetter: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.answers.remainingGroupWithFirstLetter = payload;
    },
    setAnswersRemainingLocation: (
      state,
      { payload }: PayloadAction<RemainingAnswersLocations>,
    ) => {
      state.data.answers.remainingLocation = payload;
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
