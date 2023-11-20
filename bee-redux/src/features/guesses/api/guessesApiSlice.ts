/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { apiSlice } from "@/features/api";
import { RootState } from "@/app/store";
import {
  AttemptFormat,
  GuessFormat,
  GuessFormData,
  RawAttemptFormat,
  RawGuessFormat,
} from "./guessesSlice";
import { selectAnswerWords, selectExcludedWords } from "@/features/puzzle";

export const processGuess = (
  { attemptId, text, isSpoiled, createdAt }: RawGuessFormat,
  state: RootState,
): GuessFormat => {
  const answerWords = selectAnswerWords(state);
  const isAnswer = answerWords.includes(text);
  let isExcluded = false;
  if (!isAnswer) {
    const excludedWords = selectExcludedWords(state);
    isExcluded = excludedWords.includes(text);
  }
  return {
    attemptId,
    text,
    createdAt,
    isSpoiled,
    isAnswer,
    isExcluded,
  };
};

export const processAttempts = (
  rawAttempts: RawAttemptFormat[],
  state: RootState,
) => {
  const processedAttempts: AttemptFormat[] = [];
  for (const attempt of rawAttempts) {
    processedAttempts.push({
      id: attempt.id,
      puzzleId: attempt.puzzleId,
      guesses: attempt.guesses.map((guess) => processGuess(guess, state)),
    });
  }
  return processedAttempts;
};

export const guessesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttempts: builder.query({
      query: (puzzleId) => ({
        url: `/user_puzzle_attempts/${puzzleId}`,
      }),
    }),
    getCurrentAttempts: builder.query<AttemptFormat[], void>({
      queryFn: async (_args, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const puzzleId = state.puzzle.data.id;
        if (puzzleId === 0) {
          return { error: { status: 404, data: "No puzzle loaded" } };
        }
        const { data } = await baseQuery(
          `/user_puzzle_attempts_for_puzzle/${puzzleId}`,
        );
        return { data: processAttempts(data as RawAttemptFormat[], state) };
      },
    }),
    addAttempt: builder.mutation({
      query: () => ({
        url: "/user_puzzle_attempts/",
        method: "POST",
        body: {},
      }),
    }),
    deleteAttempt: builder.mutation({
      query: (attemptId: number) => ({
        url: `/user_puzzle_attempts/${attemptId}`,
        method: "DELETE",
      }),
    }),
    addGuess: builder.mutation<GuessFormat, GuessFormData>({
      queryFn: async (
        guessData: GuessFormData,
        api,
        _extraOptions,
        baseQuery,
      ) => {
        const state = api.getState() as RootState;
        const { data } = await baseQuery({
          url: "/guesses",
          method: "POST",
          body: guessData,
        });
        return { data: processGuess(data as RawGuessFormat, state) };
      },
    }),
  }),
});

export const {
  useAddAttemptMutation,
  useDeleteAttemptMutation,
  useLazyGetCurrentAttemptsQuery,
  useAddGuessMutation,
} = guessesApiSlice;
