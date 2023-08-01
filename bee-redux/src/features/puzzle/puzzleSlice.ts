import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchPuzzle } from "./puzzleAPI";
import { RootState } from "../../app/store";
import { calculateScore } from "../../utils/utils";
import { sortBy } from "lodash";
import { selectCorrectGuessWords } from "../guesses/guessesSlice";

interface Rank {
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
    name: "beginner",
    multiplier: 0,
    rank: 1,
  },
  {
    id: "goodStart",
    name: "good start",
    multiplier: 0.02,
    rank: 2,
  },
  {
    id: "movingUp",
    name: "moving up",
    multiplier: 0.05,
    rank: 3,
  },
  {
    id: "good",
    name: "good",
    multiplier: 0.08,
    rank: 4,
  },
  {
    id: "solid",
    name: "solid",
    multiplier: 0.15,
    rank: 5,
  },
  {
    id: "nice",
    name: "nice",
    multiplier: 0.25,
    rank: 6,
  },
  {
    id: "great",
    name: "great",
    multiplier: 0.4,
    rank: 7,
  },
  {
    id: "amazing",
    name: "amazing",
    multiplier: 0.5,
    rank: 8,
  },
  {
    id: "genius",
    name: "genius",
    multiplier: 0.7,
    rank: 9,
  },
  {
    id: "queenBee",
    name: "queen bee",
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
  date: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  pangrams: string[];
  perfectPangrams: string[];
  answers: AnswerFormat[];
  excludedWords: string[];
}

export const BlankPuzzle: PuzzleFormat = {
  date: "01-01-1600",
  centerLetter: "_",
  outerLetters: ["_", "_", "_", "_", "_", "_"],
  validLetters: ["_", "_", "_", "_", "_", "_", "_"],
  pangrams: [],
  perfectPangrams: [],
  answers: [],
  excludedWords: [],
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
  error: string | null;
}

const initialState: PuzzleState = {
  data: BlankPuzzle,
  status: PuzzleStatuses.Initial,
  error: null,
};

export const fetchPuzzleAsync = createAsyncThunk(
  "puzzle/fetchPuzzle",
  async (identifier: string) => {
    const response = await fetchPuzzle(identifier);
    return response;
  },
);

export const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPuzzleAsync.pending, (state) => {
        state.status = PuzzleStatuses.Pending;
      })
      .addCase(fetchPuzzleAsync.fulfilled, (state, action) => {
        state.status = PuzzleStatuses.Succeeded;
        if (!action.payload.error) {
          state.data = action.payload;
        }
      })
      .addCase(fetchPuzzleAsync.rejected, (state, action) => {
        state.status = PuzzleStatuses.Failed;
        if (action.error.message) {
          state.error = action.error.message;
        }
      });
  },
});

export const {} = puzzleSlice.actions;

export const selectPuzzleStatus = (state: RootState) => state.puzzle.status;
export const selectPuzzle = (state: RootState) => state.puzzle.data;
export const selectDate = (state: RootState) => state.puzzle.data.date;
export const selectCenterLetter = (state: RootState) =>
  state.puzzle.data.centerLetter;
export const selectOuterLetters = (state: RootState) =>
  state.puzzle.data.outerLetters;
export const selectValidLetters = (state: RootState) =>
  state.puzzle.data.validLetters;
export const selectPangrams = (state: RootState) => state.puzzle.data.pangrams;
export const selectPerfectPangrams = (state: RootState) =>
  state.puzzle.data.perfectPangrams;
export const selectAnswers = (state: RootState) => state.puzzle.data.answers;
export const selectExcludedWords = (state: RootState) =>
  state.puzzle.data.excludedWords;

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
  [selectAnswerWords, selectCorrectGuessWords],
  (answerWords, correctGuessWords) => {
    return answerWords.filter(
      (answerWord) => !correctGuessWords.includes(answerWord),
    );
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
