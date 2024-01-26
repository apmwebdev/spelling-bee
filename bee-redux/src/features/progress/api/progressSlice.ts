/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  selectGuesses,
  selectGuessWords,
  selectSpoiledWords,
} from "@/features/guesses/api/guessesSlice";
import {
  selectAnswers,
  selectRanks,
  selectTotalPoints,
} from "@/features/puzzle/api/puzzleSlice";
import { calculateScore } from "@/util";
import {
  AnswersByLetter,
  AnswersByLetterSortable,
  createLetterAnswers,
  ProgressData,
  ProgressStatusSettings,
  RankProgress,
} from "@/features/progress/types/progressTypes";
import { createInitialState, Statuses } from "@/types/globalTypes";
import { RootState } from "@/app/store";
import { BLANK_RANK, getNextRank } from "@/features/puzzle";

const initialState = createInitialState<ProgressStatusSettings>({
  showTotalWords: true,
  showTotalPoints: true,
});

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgressShowTotalWords: (state, { payload }: PayloadAction<boolean>) => {
      state.data.showTotalWords = payload;
      state.status = Statuses.UpToDate;
    },
    setProgressShowTotalPoints: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.data.showTotalPoints = payload;
      state.status = Statuses.UpToDate;
    },
  },
  extraReducers: (builder) => {},
});

export const { setProgressShowTotalWords, setProgressShowTotalPoints } =
  progressSlice.actions;

export const selectProgressSettings = (state: RootState) => state.progress.data;

export const selectKnownAnswers = createSelector(
  [selectAnswers, selectGuessWords],
  (answers, guessWords) =>
    answers.filter((answer) => guessWords.includes(answer.word)),
);

export const selectKnownAnswerWords = createSelector(
  [selectKnownAnswers],
  (answers) => answers.map((answer) => answer.word),
);

export const selectRemainingAnswers = createSelector(
  [selectAnswers, selectKnownAnswerWords],
  (answers, knownWords) =>
    answers.filter((answer) => !knownWords.includes(answer.word)),
);

export const selectRemainingAnswerWords = createSelector(
  [selectRemainingAnswers],
  (answers) => {
    return answers.map((answer) => answer.word);
  },
);

export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer && !guess.isSpoiled),
);

export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guesses) => guesses.map((guess) => guess.text),
);

export const selectKnownAnswerGuesses = createSelector(
  [selectGuesses],
  (guesses) => guesses.filter((guess) => guess.isAnswer),
);

export const selectWrongGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => !guess.isAnswer),
);

export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export const selectCurrentRank = createSelector(
  [selectRanks, selectScore],
  (ranks, score) => {
    return ranks.findLast((rank) => rank.pointThreshold <= score);
  },
);

export const selectCurrentOrBlankRank = createSelector(
  [selectCurrentRank],
  (currentRank) => currentRank ?? BLANK_RANK,
);

export const selectRankProgress = createSelector(
  [selectCurrentRank, selectRanks, selectScore],
  (currentRank, ranks, score): RankProgress => {
    const nextRank = getNextRank(currentRank, ranks);
    const calculatePointsUntilNextRank = () => {
      if (currentRank === undefined || nextRank === undefined) return 0;
      return nextRank.pointThreshold - score;
    };
    return {
      currentRank: currentRank ?? BLANK_RANK,
      nextRank,
      pointsUntilNextRank: calculatePointsUntilNextRank(),
    };
  },
);

export const selectProgressData = createSelector(
  [
    selectCorrectGuessWords,
    selectSpoiledWords,
    selectAnswers,
    selectScore,
    selectTotalPoints,
    selectRankProgress,
  ],
  (
    foundAnswers,
    spoiledAnswers,
    answers,
    score,
    totalPoints,
    rankData,
  ): ProgressData => {
    const knownCount = foundAnswers.length + spoiledAnswers.length;
    const spoiledPoints = calculateScore(spoiledAnswers);
    const pointsFoundPercentage = (score / totalPoints) * 100;
    const spoiledPointsPercentage = (spoiledPoints / totalPoints) * 100;

    return {
      answerData: {
        totalCount: answers.length,
        foundCount: foundAnswers.length,
        spoiledCount: spoiledAnswers.length,
        knownCount,
        remainingCount: answers.length - knownCount,
      },
      scoreData: {
        current: score,
        total: totalPoints,
        spoiledPoints,
        maxAchievable: totalPoints - spoiledPoints,
      },
      percentageData: {
        pointsFound: pointsFoundPercentage,
        pointsSpoiled: spoiledPointsPercentage,
        pointsAchievable: 100 - spoiledPointsPercentage,
      },
      rankData,
    };
  },
);

export const selectAnswersByLetter = createSelector(
  [selectAnswers, selectKnownAnswerWords],
  (answers, knownWords) => {
    const asc: AnswersByLetter = {};
    const desc: AnswersByLetter = {};
    const answersByLetterSortable: AnswersByLetterSortable = { asc, desc };
    for (const answer of answers) {
      const firstLetter = answer.word[0];
      if (asc[firstLetter] === undefined) {
        asc[firstLetter] = createLetterAnswers();
        desc[firstLetter] = createLetterAnswers();
      }
      asc[firstLetter].all.push(answer);
      desc[firstLetter].all.unshift(answer);
      if (knownWords.includes(answer.word)) {
        asc[firstLetter].known.push(answer);
        desc[firstLetter].known.unshift(answer);
      } else {
        asc[firstLetter].unknown.push(answer);
        desc[firstLetter].unknown.unshift(answer);
      }
    }
    for (const letter in asc) {
      asc[letter].unknown.sort((a, b) => a.word.length - b.word.length);
      desc[letter].unknown.sort((a, b) => b.word.length - a.word.length);
    }
    return answersByLetterSortable;
  },
);

export default progressSlice.reducer;
