import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchGuesses } from "./guessesAPI";
import { RootState } from "../../app/store";
import { calculateScore } from "../../utils/utils";
import { guessesApiSlice } from "./guessesApiSlice";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";

export enum Status {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
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

export interface GuessFormData {
  word: string;
  isAnswer: boolean;
  isExcluded: boolean;
  isSpoiled: boolean;
}

export interface GuessFormat {
  word: string;
  createdAt: number;
  isSpoiled: boolean;
  isAnswer?: boolean;
  isExcluded?: boolean;
}

export interface GuessesFormat {
  userId: number;
  puzzleId: string;
  guesses: GuessFormat[];
  // includes: Function
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

const createGuessObject = (guessData: GuessFormData): GuessFormat => {
  return {
    word: guessData.word,
    createdAt: Date.now(),
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
      state.data.currentAttempt.guesses.push(createGuessObject(action.payload));
    },
    spoilWord: (state, action: { payload: GuessFormData; type: string }) => {
      state.data.currentAttempt.guesses.push(createGuessObject(action.payload));
    },
    setCurrentAttempt: (
      state,
      action: { payload: number; type: string },
    ) => {
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
      // .addCase(fetchGuessesAsync.pending, (state) => {
      //   state.status = Status.Loading;
      // })
      // .addCase(fetchGuessesAsync.fulfilled, (state, action) => {
      //   state.status = Status.UpToDate;
      //   state.data = action.payload;
      // })
      // .addCase(fetchGuessesAsync.rejected, (state) => {
      //   state.status = Status.Error;
      // })
      .addMatcher<CurrentAttemptsFulfilledResponse>(
        guessesApiSlice.endpoints.getCurrentAttempts.matchFulfilled,
        (state, { payload }) => {
          state.data.attempts = payload;
          state.data.currentAttempt = payload.slice(-1)[0] as AttemptFormat;
          state.status = Status.UpToDate;
        },
      );
  },
});

export const { addGuess, spoilWord, setCurrentAttempt } = guessesSlice.actions;

export const selectGuessesData = (state: RootState) => state.guesses.data;
export const selectCurrentAttempt = (state: RootState) =>
  state.guesses.data.currentAttempt;
export const selectAttempts = (state: RootState) => state.guesses.data.attempts;
export const selectGuesses = (state: RootState) =>
  state.guesses.data.currentAttempt.guesses;
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
export const selectKnownWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer).map((guess) => guess.word),
);
export const selectSpoiledWords = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isSpoiled).map((guess) => guess.word),
);
export const selectWrongGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => !guess.isAnswer),
);
export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export default guessesSlice.reducer;
