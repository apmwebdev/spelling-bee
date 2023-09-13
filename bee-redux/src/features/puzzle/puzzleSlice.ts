import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { calculateScore } from "@/utils";
import { sortBy } from "lodash";
import { selectGuessWords } from "../guesses/guessesSlice";
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

export type TAnswersByLetter = {
  [letter: string]: AnswerFormat[];
};

export type LetterGuesses = {
  known: AnswerFormat[];
  unknown: AnswerFormat[];
  all: AnswerFormat[];
};

export const createLetterGuesses = (): LetterGuesses => ({
  known: [],
  unknown: [],
  all: [],
});

export type TAnswersByLetterProcessed = {
  [letter: string]: LetterGuesses;
};

export const selectPuzzleStatus = (state: RootState) => state.puzzle.status;
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
export const selectAnswersByLetter = createSelector(
  [selectAnswers],
  (answers) => {
    const answerObj: TAnswersByLetter = {};
    for (const answer of answers) {
      if (answerObj[answer.word[0]] === undefined) {
        answerObj[answer.word[0]] = [];
      }
      answerObj[answer.word[0]].push(answer);
    }
    return answerObj;
  },
);

export const selectKnownAnswers = createSelector(
  [selectAnswers, selectGuessWords],
  (answers, guessWords) =>
    answers.filter((answer) => guessWords.includes(answer.word)),
);

export const selectKnownWords = createSelector(
  [selectKnownAnswers],
  (answers) => answers.map((answer) => answer.word),
);

export const selectAnswersByLetterProcessed = createSelector(
  [selectAnswers, selectKnownWords],
  (answers, knownWords) => {
    const answerObj: TAnswersByLetterProcessed = {};
    for (const answer of answers) {
      const firstLetter = answer.word[0];
      if (answerObj[firstLetter] === undefined) {
        answerObj[firstLetter] = createLetterGuesses();
      }
      answerObj[firstLetter].all.push(answer);
      if (knownWords.includes(answer.word)) {
        answerObj[firstLetter].known.push(answer);
      } else {
        answerObj[firstLetter].unknown.push(answer);
      }
    }
    return answerObj;
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
