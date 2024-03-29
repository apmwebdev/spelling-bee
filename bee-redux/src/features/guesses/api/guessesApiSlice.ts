/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  apiSlice,
  createRtkqCustomErrorResponse,
  isFetchBaseQueryErrorResponse,
} from "@/features/api";
import { RootState } from "@/app/store";
import { selectAnswerWords, selectExcludedWords } from "@/features/puzzle";
import {
  isRawGuessResponse,
  RailsGuessFormat,
  RawGuess,
  TGuess,
} from "@/features/guesses";
import {
  UuidRecordStatus,
  UuidUpdateData,
} from "@/features/api/types/apiTypes";
import { devLog } from "@/util";

const railsifyGuess = (guess: TGuess): RailsGuessFormat => {
  return {
    uuid: guess.uuid,
    user_puzzle_attempt_uuid: guess.attemptUuid,
    text: guess.text,
    created_at: guess.createdAt,
    is_spoiled: guess.isSpoiled,
  };
};

export const processGuess = (
  { uuid, attemptUuid, text, createdAt, isSpoiled }: RawGuess,
  state: RootState,
): TGuess => {
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
    getGuesses: builder.query<TGuess[], string>({
      query: (attempt_uuid) => ({
        url: `/user_puzzle_attempt_guesses/${attempt_uuid}`,
      }),
    }),
    addGuess: builder.mutation<TGuess, TGuess>({
      queryFn: async (guess: TGuess, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const response = await baseQuery({
          url: "/guesses",
          method: "POST",
          body: { guess: railsifyGuess(guess) },
        });
        //Happy path
        if (isRawGuessResponse(response)) {
          return { data: processGuess(response.data, state) };
        }
        //An error response in the expected format. Return as is
        if (isFetchBaseQueryErrorResponse(response)) {
          return response;
        }
        //Unexpected response. Return error
        return createRtkqCustomErrorResponse({
          data: response,
          error: "Invalid response format for addGuess",
        });
      },
    }),
    addBulkGuesses: builder.mutation<UuidRecordStatus[], TGuess[]>({
      query: (guessData) => ({
        url: "/guesses/bulk_add",
        method: "POST",
        body: {
          guesses: guessData.map((guess) => railsifyGuess(guess)),
        },
      }),
    }),
    updateGuessUuids: builder.mutation<UuidUpdateData[], UuidUpdateData[]>({
      queryFn: (uuids, api) => {
        devLog("This endpoint hasn't been implemented yet.");
        return { data: [] };
      },
    }),
  }),
});

export const { useLazyGetGuessesQuery, useAddGuessMutation } = guessesApiSlice;
