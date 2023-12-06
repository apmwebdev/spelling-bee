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
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  createInitialState,
  isErrorResponse,
  isUuid,
  StateShape,
  Statuses,
  Uuid,
} from "@/types";
import {
  AttemptFormat,
  BLANK_ATTEMPT,
  isAttemptFormat,
} from "@/features/userPuzzleAttempts";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { RootState } from "@/app/store";
import { userPuzzleAttemptsApiSlice } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";
import { last } from "lodash";
import { devLog } from "@/util";
import { addIdbAttempt } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import { createResultsContainer } from "@/features/api/types";
import * as crypto from "crypto";
import { selectPuzzleId } from "@/features/puzzle";

type UserPuzzleAttemptsStateData = {
  currentAttempt: AttemptFormat;
  attempts: AttemptFormat[];
};

const initialState: StateShape<UserPuzzleAttemptsStateData> =
  createInitialState({
    currentAttempt: BLANK_ATTEMPT,
    attempts: [],
  });

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
    setAttempts: (state, { payload }: PayloadAction<Array<AttemptFormat>>) => {
      state.data.attempts = payload;
      state.data.currentAttempt = last(payload) ?? BLANK_ATTEMPT;
    },
    addAttempt: (state, { payload }: PayloadAction<AttemptFormat>) => {
      if (!isAttemptFormat(payload)) {
        devLog("Invalid attempt:", payload);
        return;
      }
      state.data.attempts.push(payload);
      state.data.currentAttempt = payload;
    },
    deleteAttempt: (state, { payload }: PayloadAction<Uuid>) => {
      if (!isUuid(payload)) {
        devLog("Can't delete user puzzle attempt: Invalid UUID.", payload);
        return;
      }
      const upaIndexToDelete = state.data.attempts.findIndex(
        (attempt) => attempt.uuid === payload,
      );
      if (upaIndexToDelete === -1) {
        devLog("Can't delete user puzzle attempt: Not found.", payload);
        return;
      }
      if (state.data.currentAttempt.uuid === payload) {
        state.data.attempts.splice(upaIndexToDelete, 1);
        state.data.currentAttempt =
          state.data.attempts.length === 0
            ? BLANK_ATTEMPT
            : state.data.attempts.slice(-1)[0];
        return;
      }
      //TODO: Delete associated guesses unless attempt is being "undone" after it is created
      // because it couldn't be saved anywhere
      state.data.attempts.splice(upaIndexToDelete, 1);
    },
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
      userPuzzleAttemptsApiSlice.endpoints.getPuzzleAttempts.matchFulfilled,
      (state, { payload }) => {
        state.data.attempts = payload;
        state.data.currentAttempt = payload.slice(-1)[0];
        state.status = Statuses.UpToDate;
      },
    );
  },
});

export const { setAttempts, addAttempt, deleteAttempt, setCurrentAttempt } =
  userPuzzleAttemptsSlice.actions;

export const generateUserPuzzleAttempt = (puzzleId: number): AttemptFormat => {
  return {
    uuid: crypto.randomUUID(),
    puzzleId,
    createdAt: Date.now(),
  };
};

export const addAttemptThunk = createAsyncThunk(
  "userPuzzleAttempts/addAttemptThunk",
  async (attempt: AttemptFormat, api) => {
    if (!isAttemptFormat(attempt)) {
      //TODO: Add better error handling
      devLog("Invalid attempt. Exiting");
      return;
    }
    const state = api.getState() as RootState;
    //Note the UUID in case there's a collision during persistence and it needs to be updated
    const originalUuid = attempt.uuid;
    api.dispatch(addAttempt(attempt));
    const results = createResultsContainer<AttemptFormat, AttemptFormat>();
    results.idb = await addIdbAttempt(attempt);
    if (!state.auth.isGuest) {
      results.server = await api.dispatch(
        userPuzzleAttemptsApiSlice.endpoints.addAttempt.initiate(attempt),
      );
    }
    //If neither DB saved the attempt, remove it from Redux as well
    if (
      results.idb === null &&
      (isErrorResponse(results.server) || results.server === null)
    ) {
      //TODO: Add better error handling
      devLog(
        "Couldn't save user puzzle attempt locally or remotely. Deleting.",
      );
      api.dispatch(deleteAttempt(originalUuid));
      return;
    }
    //Check UUIDs to make sure they match in all places
  },
);

export const generateNewAttemptThunk = createAsyncThunk(
  "userPuzzleAttempts/generateNewGuestAttemptThunk",
  async (_arg, api) => {
    const state = api.getState() as RootState;
    const puzzleId = selectPuzzleId(state);
    api.dispatch(addAttemptThunk(generateUserPuzzleAttempt(puzzleId)));
  },
);

export const selectCurrentAttempt = (state: RootState) =>
  state.userPuzzleAttempts.data.currentAttempt;
export const selectCurrentAttemptUuid = createSelector(
  [selectCurrentAttempt],
  (attempt) => attempt.uuid,
);
export const selectAttempts = (state: RootState) =>
  state.userPuzzleAttempts.data.attempts;

export default userPuzzleAttemptsSlice.reducer;
