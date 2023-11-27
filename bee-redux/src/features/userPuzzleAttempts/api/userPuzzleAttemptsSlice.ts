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
import { Statuses } from "@/types";
import { AttemptFormat, BLANK_ATTEMPT } from "@/features/userPuzzleAttempts";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { RootState } from "@/app/store";
import { userPuzzleAttemptsApiSlice } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";

type UserPuzzleAttemptsStateData = {
  currentAttempt: AttemptFormat;
  attempts: AttemptFormat[];
};

type UserPuzzleAttemptsState = {
  data: UserPuzzleAttemptsStateData;
  status: Statuses;
};

const initialState: UserPuzzleAttemptsState = {
  data: {
    currentAttempt: BLANK_ATTEMPT,
    attempts: [],
  },
  status: Statuses.Initial,
};

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

export const userPuzzleAttemptsSlice = createSlice({
  name: "userPuzzleAttempts",
  initialState,
  reducers: {
    setCurrentAttempt: (state, { payload }: PayloadAction<string>) => {
      const newCurrent = state.data.attempts.find(
        (attempt) => attempt.uuid === payload,
      );
      if (newCurrent) {
        state.data.currentAttempt = newCurrent;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher<CurrentAttemptsFulfilledResponse>(
      userPuzzleAttemptsApiSlice.endpoints.getCurrentAttempts.matchFulfilled,
      (state, { payload }) => {
        state.data.attempts = payload;
        state.data.currentAttempt = payload.slice(-1)[0];
        state.status = Statuses.UpToDate;
      },
    );
  },
});

export const { setCurrentAttempt } = userPuzzleAttemptsSlice.actions;

export const selectCurrentAttempt = (state: RootState) =>
  state.userPuzzleAttempts.data.currentAttempt;
export const selectCurrentAttemptUuid = createSelector(
  [selectCurrentAttempt],
  (attempt) => attempt.uuid,
);
export const selectAttempts = (state: RootState) =>
  state.userPuzzleAttempts.data.attempts;

export default userPuzzleAttemptsSlice.reducer;
