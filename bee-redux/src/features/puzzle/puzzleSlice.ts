import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { calculateScore } from "../../utils/utils";
import { sortBy } from "lodash";
import { selectKnownWords } from "../guesses/guessesSlice";
import { puzzleApiSlice } from "./puzzleApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface Rank {
  id: string;
  name: string;
  multiplier: number;
  rank: number;
  score?: number;
}

type RanksType = [Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank];

const Ranks: RanksType = [
  {
    id: "beginner",
    name: "Beginner",
    multiplier: 0,
    rank: 1,
  },
  {
    id: "goodStart",
    name: "Good Start",
    multiplier: 0.02,
    rank: 2,
  },
  {
    id: "movingUp",
    name: "Moving Up",
    multiplier: 0.05,
    rank: 3,
  },
  {
    id: "good",
    name: "Good",
    multiplier: 0.08,
    rank: 4,
  },
  {
    id: "solid",
    name: "Solid",
    multiplier: 0.15,
    rank: 5,
  },
  {
    id: "nice",
    name: "Nice",
    multiplier: 0.25,
    rank: 6,
  },
  {
    id: "great",
    name: "Great",
    multiplier: 0.4,
    rank: 7,
  },
  {
    id: "amazing",
    name: "Amazing",
    multiplier: 0.5,
    rank: 8,
  },
  {
    id: "genius",
    name: "Genius",
    multiplier: 0.7,
    rank: 9,
  },
  {
    id: "queenBee",
    name: "Queen Bee",
    multiplier: 1,
    rank: 10,
  },
];

export interface AnswerFormat {
  word: string;
  frequency: number;
  definitions: string[];
}

export interface PuzzleFormat {
  id: number;
  date: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  pangrams: string[];
  perfectPangrams: string[];
  answers: AnswerFormat[];
  excludedWords: string[];
  isLatest: boolean;
}

export const BlankPuzzle: PuzzleFormat = {
  id: 0,
  date: "00-00-0000",
  centerLetter: "_",
  outerLetters: ["_", "_", "_", "_", "_", "_"],
  validLetters: ["_", "_", "_", "_", "_", "_", "_"],
  pangrams: [],
  perfectPangrams: [],
  answers: [],
  excludedWords: [],
  isLatest: false,
};

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

export const selectRemainingAnswerWords = createSelector(
  [selectAnswerWords, selectKnownWords],
  (answerWords, knownWords) => {
    return answerWords.filter((answerWord) => !knownWords.includes(answerWord));
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
