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
import { selectAnswerWords, selectExcludedWords } from "@/features/puzzle";
import {
  GuessFormat,
  RailsGuessFormData,
  RawGuessFormat,
} from "@/features/guesses";

export const processGuess = (
  { uuid, attemptUuid, text, createdAt, isSpoiled }: RawGuessFormat,
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
    uuid,
    attemptUuid,
    text,
    createdAt,
    isSpoiled,
    isAnswer,
    isExcluded,
  };
};

export const guessesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGuesses: builder.query<GuessFormat[], string>({
      query: (attempt_uuid) => ({
        url: `/user_puzzle_attempt_guesses/${attempt_uuid}`,
      }),
    }),
    addGuess: builder.mutation<GuessFormat, RailsGuessFormData>({
      queryFn: async (
        guessData: RailsGuessFormData,
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

export const { useLazyGetGuessesQuery, useAddGuessMutation } = guessesApiSlice;
