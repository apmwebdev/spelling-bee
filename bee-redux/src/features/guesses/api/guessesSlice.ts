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
import { Statuses } from "@/types";
import { GuessFormat } from "@/features/guesses";

export type GuessesState = {
  data: GuessFormat[];
  status: Statuses;
};

const initialState: GuessesState = {
  data: [],
  status: Statuses.Initial,
};

export const guessesSlice = createSlice({
  name: "guesses",
  initialState,
  reducers: {
    getGuesses: (state, { payload }: PayloadAction<GuessFormat[]>) => {
      state.data = payload;
    },
    addGuess: (state, { payload }: PayloadAction<GuessFormat>) => {
      state.data.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        guessesApiSlice.endpoints.getGuesses.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
        },
      )
      .addMatcher(
        guessesApiSlice.endpoints.addGuess.matchFulfilled,
        (state, { payload }) => {
          state.data.push(payload);
        },
      );
  },
});

export const { addGuess } = guessesSlice.actions;

export const selectGuesses = (state: RootState) => state.guesses.data;
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
