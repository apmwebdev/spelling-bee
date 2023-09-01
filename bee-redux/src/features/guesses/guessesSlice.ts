import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { calculateScore } from "@/utils";
import { guessesApiSlice } from "./guessesApiSlice";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";

export enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export interface RawAttemptFormat {
  id: number;
  puzzleId: number;
  guesses: RawGuessFormat[];
}

export interface AttemptFormat {
  id: number;
  puzzleId: number;
  guesses: GuessFormat[];
}

type CurrentAttemptsFulfilledResponse = PayloadAction<
  AttemptFormat[],
  string,
  {
    arg: QueryThunkArg & {
      originalArgs: any;
    };
    requestId: string;
    requestStatus: "fulfilled";
  } & {
    fulfilledTimeStamp: number;
    baseQueryMeta: unknown;
    RTK_autoBatch: true;
  },
  never
>;

type AddGuessFulfilledResponse = PayloadAction<
  GuessFormat,
  string,
  {
    arg: QueryThunkArg & {
      originalArgs: any;
    };
    requestId: string;
    requestStatus: "fulfilled";
  } & {
    fulfilledTimeStamp: number;
    baseQueryMeta: unknown;
    RTK_autoBatch: true;
  },
  never
>;

export interface GuessFormData {
  guess: {
    user_puzzle_attempt_id: number;
    text: string;
    is_spoiled: boolean;
  };
}

export interface RawGuessFormat {
  attemptId: number;
  text: string;
  isSpoiled: boolean;
  createdAt: string;
}

export interface GuessFormat {
  attemptId: number;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
  isAnswer: boolean;
  isExcluded: boolean;
}

export interface GuessesStateData {
  currentAttempt: AttemptFormat;
  attempts: AttemptFormat[];
}

export interface GuessesState {
  data: GuessesStateData;
  status: Status;
}

const initialState: GuessesState = {
  data: {
    currentAttempt: {
      id: 0,
      puzzleId: 0,
      guesses: [],
    },
    attempts: [],
  },
  status: Status.Initial,
};

// export const fetchGuessesAsync = createAsyncThunk(
//   "guesses/fetchGuesses",
//   async (puzzleId: string) => {
//     const response = await fetchGuesses(0, puzzleId);
//     return response.data;
//   },
// );

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    setCurrentAttempt: (state, action: { payload: number; type: string }) => {
      const newCurrent = state.data.attempts.find(
        (attempt) => attempt.id === action.payload,
      );
      if (newCurrent) {
        state.data.currentAttempt = newCurrent;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher<AddGuessFulfilledResponse>(
        guessesApiSlice.endpoints.addGuess.matchFulfilled,
        (state, { payload }) => {
          state.data.currentAttempt.guesses.push(payload);
        },
      )
      .addMatcher<CurrentAttemptsFulfilledResponse>(
        guessesApiSlice.endpoints.getCurrentAttempts.matchFulfilled,
        (state, { payload }) => {
          state.data.attempts = payload;
          state.data.currentAttempt = payload.slice(-1)[0];
          state.status = Status.UpToDate;
        },
      );
  },
});

export const { setCurrentAttempt } = guessesSlice.actions;

export const selectGuessesData = (state: RootState) => state.guesses.data;
export const selectCurrentAttempt = (state: RootState) =>
  state.guesses.data.currentAttempt;
export const selectCurrentAttemptId = createSelector(
  [selectCurrentAttempt],
  (attempt) => attempt.id,
);
export const selectAttempts = (state: RootState) => state.guesses.data.attempts;
export const selectGuesses = (state: RootState) =>
  state.guesses.data.currentAttempt.guesses;
export const selectGuessWords = createSelector([selectGuesses], (guesses) =>
  guesses.map((guess) => guess.text),
);
export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer && !guess.isSpoiled),
);
export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guesses) =>
    guesses
      .filter((guess) => guess.isAnswer && !guess.isSpoiled)
      .map((guess) => guess.text),
);
export const selectKnownWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer).map((guess) => guess.text),
);
export const selectSpoiledWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isSpoiled).map((guess) => guess.text),
);
export const selectWrongGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => !guess.isAnswer),
);
export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export default guessesSlice.reducer;
