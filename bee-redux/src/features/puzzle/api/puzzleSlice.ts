import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { calculateScore } from "@/util";
import { sortBy } from "lodash";
import { selectGuessWords } from "@/features/guesses";
import {
  AnswerFormat,
  BlankPuzzle,
  puzzleApiSlice,
  PuzzleFormat,
  Ranks,
} from "./puzzleApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export enum PuzzleStatuses {
  Initial = "Not Fetched",
  Pending = "Loading...",
  Succeeded = "Up To Date",
  Failed = "Error",
}

export interface PuzzleState {
  data: PuzzleFormat;
  status: PuzzleStatuses;
  error: FetchBaseQueryError | undefined;
}

const initialState: PuzzleState = {
  data: BlankPuzzle,
  status: PuzzleStatuses.Initial,
  error: undefined,
};

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        puzzleApiSlice.endpoints.getPuzzle.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
          state.status = PuzzleStatuses.Succeeded;
          state.error = undefined;
        },
      )
      // TODO: Add error handling
      .addMatcher(
        puzzleApiSlice.endpoints.getPuzzle.matchRejected,
        (state, { payload }) => {
          state.data = BlankPuzzle;
          state.status = PuzzleStatuses.Failed;
          state.error = payload;
          console.log("puzzleSlice: getPuzzle.matchRejected:", payload);
        },
      )
      // TODO: Add loading state handling
      .addMatcher(puzzleApiSlice.endpoints.getPuzzle.matchPending, (state) => {
        state.status = PuzzleStatuses.Pending;
        state.error = undefined;
      });
  },
});

export const {} = puzzleSlice.actions;

export const selectPuzzle = (state: RootState) => state.puzzle.data;
export const selectPuzzleId = (state: RootState) => state.puzzle.data.id;
export const selectDate = (state: RootState) => state.puzzle.data.date;
export const selectCenterLetter = (state: RootState) =>
  state.puzzle.data.centerLetter;
export const selectValidLetters = (state: RootState) =>
  state.puzzle.data.validLetters;
export const selectPangrams = (state: RootState) => state.puzzle.data.pangrams;
export const selectPerfectPangrams = (state: RootState) =>
  state.puzzle.data.perfectPangrams;
export const selectAnswers = (state: RootState) => state.puzzle.data.answers;
export const selectExcludedWords = (state: RootState) =>
  state.puzzle.data.excludedWords;
export const selectIsLatest = (state: RootState) => state.puzzle.data.isLatest;

// Derived data
export const selectKnownAnswers = createSelector(
  [selectAnswers, selectGuessWords],
  (answers, guessWords) =>
    answers.filter((answer) => guessWords.includes(answer.word)),
);

export const selectKnownWords = createSelector(
  [selectKnownAnswers],
  (answers) => answers.map((answer) => answer.word),
);

export type LetterAnswers = {
  known: AnswerFormat[];
  unknown: AnswerFormat[];
  all: AnswerFormat[];
};

export const createLetterAnswers = (): LetterAnswers => ({
  known: [],
  unknown: [],
  all: [],
});

export type AnswersByLetter = {
  [letter: string]: LetterAnswers;
};

export type AnswersByLetterSortable = {
  asc: AnswersByLetter;
  desc: AnswersByLetter;
};

export const selectAnswersByLetter = createSelector(
  [selectAnswers, selectKnownWords],
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

export const selectRemainingAnswers = createSelector(
  [selectAnswers, selectKnownWords],
  (answers, knownWords) =>
    answers.filter((answer) => !knownWords.includes(answer.word)),
);

export const selectRemainingAnswerWords = createSelector(
  [selectRemainingAnswers],
  (answers) => {
    return answers.map((answer) => answer.word);
  },
);

export const selectRanks = createSelector(
  [selectTotalPoints],
  (totalPoints) => {
    return Ranks.map((rank) => ({
      ...rank,
      score: Math.round(rank.multiplier * totalPoints),
    }));
  },
);

export default puzzleSlice.reducer;
