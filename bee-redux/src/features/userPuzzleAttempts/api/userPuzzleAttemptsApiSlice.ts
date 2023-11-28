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
import { AttemptFormat } from "@/features/userPuzzleAttempts/types";
import { devLog } from "@/util";

export const userPuzzleAttemptsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPuzzleAttempts: builder.query<AttemptFormat[], void>({
      queryFn: async (_args, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const puzzleId = state.puzzle.data.id;
        if (puzzleId === 0) {
          devLog("No puzzle");
          return { error: { status: 404, data: "No puzzle loaded" } };
        }
        const response = await baseQuery(
          `/puzzle_user_puzzle_attempts/${puzzleId}`,
        );
        return response as { data: AttemptFormat[] };
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
  }),
});

export const {
  useLazyGetPuzzleAttemptsQuery,
  useAddAttemptMutation,
  useDeleteAttemptMutation,
} = userPuzzleAttemptsApiSlice;
