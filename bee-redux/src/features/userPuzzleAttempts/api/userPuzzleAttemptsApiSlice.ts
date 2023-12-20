/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { apiSlice, keysToSnakeCase } from "@/features/api";
import { RootState } from "@/app/store";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts/types";
import { devLog } from "@/util";
import { UuidRecordStatus, UuidUpdateData } from "@/features/api/types";

export const userPuzzleAttemptsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPuzzleAttempts: builder.query<UserPuzzleAttempt[], void>({
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
        return response as { data: UserPuzzleAttempt[] };
      },
    }),
    addAttempt: builder.mutation<UserPuzzleAttempt, UserPuzzleAttempt>({
      query: (attempt) => ({
        url: "/user_puzzle_attempts",
        method: "POST",
        body: { user_puzzle_attempt: keysToSnakeCase(attempt) },
      }),
    }),
    deleteAttempt: builder.mutation({
      query: (attemptId: number) => ({
        url: `/user_puzzle_attempts/${attemptId}`,
        method: "DELETE",
      }),
    }),
    addBulkAttempts: builder.mutation<
      Array<UuidRecordStatus>,
      Array<UserPuzzleAttempt>
    >({
      query: (attemptData) => ({
        url: "/user_puzzle_attempts/bulk_add",
        method: "POST",
        body: {
          user_puzzle_attempts: attemptData.map((attempt) =>
            keysToSnakeCase(attempt),
          ),
        },
      }),
    }),
    updateAttemptUuids: builder.mutation<
      Array<UuidUpdateData>,
      Array<UuidUpdateData>
    >({
      queryFn: (uuids, api) => {
        devLog("This endpoint hasn't been implemented yet.");
        return { data: [] };
      },
    }),
  }),
});

export const {
  useLazyGetPuzzleAttemptsQuery,
  useAddAttemptMutation,
  useDeleteAttemptMutation,
} = userPuzzleAttemptsApiSlice;
