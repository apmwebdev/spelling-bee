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
import { calculateScore, trackingStatusClasses } from "@/util";
import {
  AnswerProgress,
  AnswersByLetter,
  AnswersByLetterSortable,
  createLetterAnswers,
  PercentageProgress,
  ProgressData,
  ProgressStatusSettings,
  RankProgress,
  ScoreProgress,
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

export const selectProgressShowTotalWords = (state: RootState) =>
  state.progress.data.showTotalWords;

export const selectProgressShowTotalPoints = (state: RootState) =>
  state.progress.data.showTotalPoints;

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

export const selectSpoiledPoints = createSelector(
  [selectSpoiledWords],
  (spoiledWords) => calculateScore(spoiledWords),
);

export const selectKnownPoints = createSelector(
  [selectScore, selectSpoiledPoints],
  (score, spoiledPoints) => score + spoiledPoints,
);

export const selectCurrentRank = createSelector(
  [selectRanks, selectScore],
  (ranks, score) => {
    return ranks.findLast((rank) => rank.pointThreshold <= score);
  },
);

export const selectKnownRank = createSelector(
  [selectRanks, selectScore],
  (ranks, knownPoints) => {
    return ranks.findLast((rank) => rank.pointThreshold <= knownPoints);
  },
);

export const selectCurrentOrBlankRank = createSelector(
  [selectCurrentRank],
  (currentRank) => currentRank ?? BLANK_RANK,
);

export const selectAnswerProgress = createSelector(
  [selectAnswers, selectCorrectGuessWords, selectSpoiledWords],
  (answers, foundAnswers, spoiledAnswers): AnswerProgress => {
    const knownCount = foundAnswers.length + spoiledAnswers.length;

    return {
      totalCount: answers.length,
      foundCount: foundAnswers.length,
      spoiledCount: spoiledAnswers.length,
      knownCount,
      remainingCount: answers.length - knownCount,
    };
  },
);

export const selectScoreProgress = createSelector(
  [selectScore, selectTotalPoints, selectSpoiledPoints, selectKnownPoints],
  (score, totalPoints, spoiledPoints, knownPoints): ScoreProgress => {
    return {
      score,
      totalPoints,
      spoiledPoints,
      knownPoints,
      pointsCeiling: totalPoints - spoiledPoints,
    };
  },
);

export const selectPercentageProgress = createSelector(
  [selectScore, selectTotalPoints, selectSpoiledWords],
  (score, totalPoints, spoiledAnswers): PercentageProgress => {
    const spoiledPoints = calculateScore(spoiledAnswers);
    const spoiledPointsPercentage = (spoiledPoints / totalPoints) * 100;

    return {
      pointsFoundPercent: (score / totalPoints) * 100,
      pointsSpoiledPercent: spoiledPointsPercentage,
      pointsKnownPercent: ((score + spoiledPoints) / totalPoints) * 100,
      pointsAchievablePercent: 100 - spoiledPointsPercentage,
    };
  },
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

export const selectProgressStatusClasses = createSelector(
  [selectAnswerProgress],
  (answerProgress) => {
    return trackingStatusClasses({
      baseClass: "ProgressNumbers_itemNumber",
      currentCount: answerProgress.knownCount,
      totalCount: answerProgress.totalCount,
    });
  },
);

export const selectProgressData = createSelector(
  [
    selectAnswerProgress,
    selectScoreProgress,
    selectPercentageProgress,
    selectRankProgress,
  ],
  (answerData, scoreData, percentageData, rankData): ProgressData => {
    return {
      answerData,
      scoreData,
      percentageData,
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
