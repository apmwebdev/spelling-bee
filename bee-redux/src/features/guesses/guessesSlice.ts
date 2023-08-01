import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchGuesses } from "./guessesAPI";
import { RootState } from "../../app/store";
import { calculateScore } from "../../utils/utils";

export enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export interface GuessFormData {
  word: string;
  isAnswer: boolean;
  isExcluded: boolean;
  isSpoiled: boolean;
}

export interface GuessFormat {
  word: string;
  timestamp: number;
  isAnswer: boolean;
  isExcluded: boolean;
  isSpoiled: boolean;
}

export interface GuessesFormat {
  userId: number;
  puzzleId: string;
  guesses: GuessFormat[];
  // includes: Function
}

export interface GuessesState {
  data: GuessesFormat;
  status: Status;
}

const initialState: GuessesState = {
  data: { userId: 0, puzzleId: "a", guesses: [] },
  // data: guessesSampleData[0],
  status: Status.Initial,
};

export const fetchGuessesAsync = createAsyncThunk(
  "guesses/fetchGuesses",
  async (puzzleId: string) => {
    const response = await fetchGuesses(0, puzzleId);
    return response.data;
  },
);

const createGuessObject = (guessData: GuessFormData): GuessFormat => {
  return {
    word: guessData.word,
    timestamp: Date.now(),
    isAnswer: guessData.isAnswer,
    isExcluded: guessData.isExcluded,
    isSpoiled: guessData.isSpoiled,
  };
};

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    addGuess: (state, action: { payload: GuessFormData; type: string }) => {
      state.data.guesses.push(createGuessObject(action.payload));
    },
    spoilWord: (state, action: { payload: GuessFormData; type: string }) => {
      state.data.guesses.push(createGuessObject(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuessesAsync.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(fetchGuessesAsync.fulfilled, (state, action) => {
        state.status = Status.UpToDate;
        state.data = action.payload;
      })
      .addCase(fetchGuessesAsync.rejected, (state) => {
        state.status = Status.Error;
      });
  },
});

export const { addGuess, spoilWord } = guessesSlice.actions;

export const selectGuessesData = (state: RootState) => state.guesses.data;
export const selectGuesses = (state: RootState) => state.guesses.data.guesses;
export const selectGuessWords = createSelector([selectGuesses], (guesses) =>
  guesses.map((guess) => guess.word),
);
export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer && !guess.isSpoiled),
);
export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guesses) =>
    guesses
      .filter((guess) => guess.isAnswer && !guess.isSpoiled)
      .map((guess) => guess.word),
);
export const selectRevealedWords = createSelector(
  [selectGuesses],
  (guesses) =>
  guesses.filter((guess) => guess.isAnswer).map((guess) => guess.word),
);
export const selectWrongGuesses = createSelector(
  [selectGuesses],
  (guesses) => guesses.filter((guess) => !guess.isAnswer),
);
export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export default guessesSlice.reducer;
