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
import { calculateScore } from "@/util";
import { sortBy } from "lodash";
import {
  generatePuzzleRanks,
  RawPuzzle,
  TPuzzle,
} from "@/features/puzzle/types/puzzleTypes";

export const puzzleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPuzzle: builder.query<TPuzzle, string>({
      query: (identifier: string) => ({
        url: `/puzzles/${identifier}`,
      }),
      transformResponse: (response: RawPuzzle, _meta, _arg) => {
        const answerWords = response.answers.map((answer) => answer.text);
        const answerLengths = (answerWords: string[]) => {
          const returnArray: number[] = [];
          for (const answer of answerWords) {
            if (!returnArray.includes(answer.length)) {
              returnArray.push(answer.length);
            }
          }
          return sortBy(returnArray);
        };
        const totalPoints = calculateScore(answerWords);

        const processedResponse: TPuzzle = {
          ...response,
          shuffledOuterLetters: [...response.outerLetters],
          answerWords,
          totalPoints,
          answerLengths: answerLengths(answerWords),
          ranks: generatePuzzleRanks(totalPoints),
        };
        return processedResponse;
      },
    }),
  }),
});

export const { useGetPuzzleQuery } = puzzleApiSlice;
