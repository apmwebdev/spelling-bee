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
import { createInitialState, Statuses } from "@/types/globalTypes";
import {
  BLANK_ATTEMPT,
  isUserPuzzleAttempt,
  UserPuzzleAttempt,
} from "@/features/userPuzzleAttempts";
import { RootState } from "@/app/store";
import { userPuzzleAttemptsApiSlice } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";
import { last } from "lodash";
import { devLog } from "@/util";
import {
  addIdbAttempt,
  bulkAddIdbAttempts,
  updateIdbAttemptUuids,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import { DataSourceKeys, isUuid, Uuid } from "@/features/api/types/apiTypes";
import { selectPuzzleId } from "@/features/puzzle";
import {
  createAddItemThunk,
  createDataResolverThunk,
  createUuidSyncThunk,
  createUuidUpdateReducer,
} from "@/features/api/util/synchronizer";

const modelDisplayName = "attempt";

type UserPuzzleAttemptsStateData = {
  currentAttempt: UserPuzzleAttempt;
  attempts: UserPuzzleAttempt[];
};

const initialState = createInitialState<UserPuzzleAttemptsStateData>({
  currentAttempt: BLANK_ATTEMPT,
  attempts: [],
});

const attemptUuidUpdateReducer =
  createUuidUpdateReducer<UserPuzzleAttemptsStateData>({
    modelDisplayName,
    keyPathToModels: ["attempts"],
  });

export const userPuzzleAttemptsSlice = createSlice({
  name: "userPuzzleAttempts",
  initialState,
  reducers: {
    setAttempts: (state, { payload }: PayloadAction<UserPuzzleAttempt[]>) => {
      state.data.attempts = payload;
      state.data.currentAttempt = last(payload) ?? BLANK_ATTEMPT;
      state.status = Statuses.UpToDate;
    },
    addAttempt: (state, { payload }: PayloadAction<UserPuzzleAttempt>) => {
      if (!isUserPuzzleAttempt(payload)) {
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
    updateAttemptUuids: attemptUuidUpdateReducer,
  },
  extraReducers: (builder) => {
    // builder.addMatcher<CurrentAttemptsFulfilledResponse>(
    //   userPuzzleAttemptsApiSlice.endpoints.getPuzzleAttempts.matchFulfilled,
    //   (state, { payload }) => {
    //     state.data.attempts = payload;
    //     state.data.currentAttempt = payload.slice(-1)[0];
    //     state.status = Statuses.UpToDate;
    //   },
    // );
  },
});

export const {
  setAttempts,
  addAttempt,
  deleteAttempt,
  setCurrentAttempt,
  updateAttemptUuids,
} = userPuzzleAttemptsSlice.actions;

export const generateUserPuzzleAttempt = (
  puzzleId: number,
): UserPuzzleAttempt => {
  return {
    uuid: crypto.randomUUID(),
    puzzleId,
    createdAt: Date.now(),
  };
};

export const addAttemptThunk = createAddItemThunk<UserPuzzleAttempt>({
  itemDisplayType: "user puzzle attempt",
  actionType: "userPuzzleAttempts/addAttemptThunk",
  validationFn: isUserPuzzleAttempt,
  addItemReducer: addAttempt,
  deleteItemReducer: deleteAttempt,
  addIdbItemFn: addIdbAttempt,
  addServerItemEndpoint: userPuzzleAttemptsApiSlice.endpoints.addAttempt,
});

export const generateNewAttemptThunk = createAsyncThunk(
  "userPuzzleAttempts/generateNewGuestAttemptThunk",
  async (_arg, api) => {
    const state = api.getState() as RootState;
    const puzzleId = selectPuzzleId(state);
    api.dispatch(addAttemptThunk(generateUserPuzzleAttempt(puzzleId)));
  },
);

export const syncAttemptUuids = createUuidSyncThunk({
  serverUuidUpdateFn:
    userPuzzleAttemptsApiSlice.endpoints.updateAttemptUuids.initiate,
  idbUuidUpdateFn: updateIdbAttemptUuids,
  stateUuidUpdateFn: updateAttemptUuids,
});

export const resolveAttemptsData = createDataResolverThunk<UserPuzzleAttempt>({
  modelDisplayName,
  actionType: "userPuzzleAttempts/resolveAttemptsData",
  primaryDataKey: DataSourceKeys.serverData,
  setDataReducer: setAttempts,
  addBulkServerDataEndpoint:
    userPuzzleAttemptsApiSlice.endpoints.addBulkAttempts,
  addBulkIdbData: bulkAddIdbAttempts,
  syncUuidFn: syncAttemptUuids,
});

export const selectCurrentAttempt = (state: RootState) =>
  state.userPuzzleAttempts.data.currentAttempt;
export const selectCurrentAttemptUuid = createSelector(
  [selectCurrentAttempt],
  (attempt) => attempt.uuid,
);
const selectAttempts = (state: RootState) =>
  state.userPuzzleAttempts.data.attempts;

export const selectAttemptsMemoized = createSelector(
  [selectAttempts],
  (attempts) => attempts,
);

export default userPuzzleAttemptsSlice.reducer;
