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
import { RootState } from "@/app/store";
import { calculateScore } from "@/util";
import { guessesApiSlice } from "./guessesApiSlice";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { Statuses } from "@/types";
import { AttemptFormat, GuessFormat } from "@/features/guesses";
import { BLANK_UUID } from "@/features/api";

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

export type GuessesStateData = {
  currentAttempt: AttemptFormat;
  attempts: AttemptFormat[];
};

export type GuessesState = {
  data: GuessesStateData;
  status: Statuses;
};

const initialState: GuessesState = {
  data: {
    currentAttempt: {
      uuid: BLANK_UUID,
      createdAt: 0,
      puzzleId: 0,
      guesses: [],
    },
    attempts: [],
  },
  status: Statuses.Initial,
};

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    setCurrentAttempt: (state, action: { payload: string; type: string }) => {
      const newCurrent = state.data.attempts.find(
        (attempt) => attempt.uuid === action.payload,
      );
      if (newCurrent) {
        state.data.currentAttempt = newCurrent;
      }
    },
    addGuess: (state, { payload }: PayloadAction<GuessFormat>) => {
      state.data.currentAttempt.guesses.push(payload);
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
          state.status = Statuses.UpToDate;
        },
      );
  },
});

export const { setCurrentAttempt } = guessesSlice.actions;

export const selectCurrentAttempt = (state: RootState) =>
  state.guesses.data.currentAttempt;
export const selectCurrentAttemptId = createSelector(
  [selectCurrentAttempt],
  (attempt) => attempt.uuid,
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
