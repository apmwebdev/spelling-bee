/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { calculateScore, devLog } from "@/util";
import { shuffle, sortBy } from "lodash";
import { puzzleApiSlice } from "./puzzleApiSlice";
import { createInitialState, Statuses } from "@/types/globalTypes";
import { BlankPuzzle, TPuzzle } from "@/features/puzzle/types/puzzleTypes";

const initialState = createInitialState<TPuzzle>(BlankPuzzle);

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    shuffleOuterLetters: (state) => {
      state.data.shuffledOuterLetters = shuffle(
        state.data.shuffledOuterLetters,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        puzzleApiSlice.endpoints.getPuzzle.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
          state.status = Statuses.UpToDate;
          state.error = undefined;
        },
      )
      // TODO: Add error handling
      .addMatcher(
        puzzleApiSlice.endpoints.getPuzzle.matchRejected,
        (state, { payload }) => {
          state.data = BlankPuzzle;
          state.status = Statuses.Error;
          state.error = payload;
          devLog("puzzleSlice: getPuzzle.matchRejected:", payload);
        },
      )
      // TODO: Add loading state handling
      .addMatcher(puzzleApiSlice.endpoints.getPuzzle.matchPending, (state) => {
        state.status = Statuses.Pending;
        state.error = undefined;
      });
  },
});

export const { shuffleOuterLetters } = puzzleSlice.actions;

export const selectPuzzleId = (state: RootState) => state.puzzle.data.id;
export const selectDate = (state: RootState) => state.puzzle.data.date;
export const selectCenterLetter = (state: RootState) =>
  state.puzzle.data.centerLetter;
export const selectOuterLetters = (state: RootState) =>
  state.puzzle.data.outerLetters;
export const selectShuffledOuterLetters = (state: RootState) =>
  state.puzzle.data.shuffledOuterLetters;
export const selectValidLetters = (state: RootState) =>
  state.puzzle.data.validLetters;
export const selectPangrams = (state: RootState) => state.puzzle.data.pangrams;
export const selectPerfectPangrams = (state: RootState) =>
  state.puzzle.data.perfectPangrams;
export const selectAnswers = (state: RootState) => state.puzzle.data.answers;
export const selectExcludedWords = (state: RootState) =>
  state.puzzle.data.excludedWords;
export const selectIsLatest = (state: RootState) => state.puzzle.data.isLatest;

export const selectAnswerWords = createSelector([selectAnswers], (answers) => {
  if (answers && answers.length > 0) {
    return answers.map((answer) => answer.word);
  }
  return [];
});

export const selectTotalPoints = createSelector(
  [selectAnswerWords],
  (answerWords) => calculateScore(answerWords),
);

export const selectAnswerLengths = createSelector(
  [selectAnswerWords],
  (answerWords) => {
    const answerLengths: number[] = [];
    for (const answer of answerWords) {
      if (!answerLengths.includes(answer.length)) {
        answerLengths.push(answer.length);
      }
    }
    return sortBy(answerLengths);
  },
);

export default puzzleSlice.reducer;
