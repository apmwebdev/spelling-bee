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
  isBasicSuccessResponse,
  isErrorResponse,
  isUuid,
  StateShape,
  Uuid,
} from "@/types";
import {
  BLANK_ATTEMPT,
  isUserPuzzleAttempt,
  UserPuzzleAttempt,
} from "@/features/userPuzzleAttempts";
import { QueryThunkArg } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { RootState } from "@/app/store";
import { userPuzzleAttemptsApiSlice } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";
import { last } from "lodash";
import { devLog } from "@/util";
import {
  addIdbAttempt,
  bulkAddIdbAttempts,
  bulkDeleteIdbAttempts,
  updateIdbAttemptUuids,
} from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import {
  createDiffPromiseContainer,
  DataSourceKeys,
  DiffContainer,
  UuidUpdateData,
} from "@/features/api/types";
import * as crypto from "crypto";
import { selectPuzzleId } from "@/features/puzzle";
import { combineForDisplayAndSync } from "@/features/api";
import { createUuidSyncThunk } from "@/features/api/util/synchronizer";

type UserPuzzleAttemptsStateData = {
  currentAttempt: UserPuzzleAttempt;
  attempts: UserPuzzleAttempt[];
};

const initialState: StateShape<UserPuzzleAttemptsStateData> =
  createInitialState({
    currentAttempt: BLANK_ATTEMPT,
    attempts: [],
  });

type CurrentAttemptsFulfilledResponse = PayloadAction<
  UserPuzzleAttempt[],
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
    setAttempts: (
      state,
      { payload }: PayloadAction<Array<UserPuzzleAttempt>>,
    ) => {
      state.data.attempts = payload;
      state.data.currentAttempt = last(payload) ?? BLANK_ATTEMPT;
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
    updateAttemptUuids: (
      state,
      { payload }: PayloadAction<Array<UuidUpdateData>>,
    ) => {
      for (const item of payload) {
        const attemptToChange = state.data.attempts.find(
          (attempt) => attempt.uuid === item.oldUuid,
        );
        if (!attemptToChange) continue;
        attemptToChange.uuid = item.newUuid;
      }
    },
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

export const addAttemptThunk = createAsyncThunk(
  "userPuzzleAttempts/addAttemptThunk",
  async (attempt: UserPuzzleAttempt, api) => {
    if (!isUserPuzzleAttempt(attempt)) {
      //TODO: Add better error handling
      devLog("Invalid attempt. Exiting");
      return;
    }
    const state = api.getState() as RootState;
    //Note the UUID in case there's a collision during persistence and it needs to be updated
    const originalUuid = attempt.uuid;
    api.dispatch(addAttempt(attempt));
    const results = createDiffPromiseContainer<
      UserPuzzleAttempt,
      UserPuzzleAttempt
    >();
    results.idbData = await addIdbAttempt(attempt);
    if (!state.auth.isGuest) {
      results.serverData = await api.dispatch(
        userPuzzleAttemptsApiSlice.endpoints.addAttempt.initiate(attempt),
      );
    }
    //If neither DB saved the attempt, remove it from Redux as well
    if (
      results.idbData === null &&
      (isErrorResponse(results.serverData) || results.serverData === null)
    ) {
      //TODO: Add better error handling
      devLog(
        "Couldn't save user puzzle attempt locally or remotely. Deleting.",
      );
      api.dispatch(deleteAttempt(originalUuid));
      return;
    }
    //TODO: Check UUIDs to make sure they match in all places
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

export const syncAttemptUuids = createUuidSyncThunk({
  serverUuidUpdateFn:
    userPuzzleAttemptsApiSlice.endpoints.updateAttemptUuids.initiate,
  idbUuidUpdateFn: updateIdbAttemptUuids,
  stateUuidUpdateFn: updateAttemptUuids,
});

export const resolveAttemptsData = createAsyncThunk(
  "userPuzzleAttempts/resolveAttemptsData",
  async (data: DiffContainer<UserPuzzleAttempt>, api) => {
    const { displayData, idbDataToAdd, serverDataToAdd, dataToDelete } =
      combineForDisplayAndSync({
        data,
        primaryDataKey: DataSourceKeys.serverData,
      });
    api.dispatch(setAttempts(displayData));
    //bulk add server data
    const idbAndReduxUuidsToUpdate: Array<UuidUpdateData> = [];
    const serverResult = await api
      .dispatch(
        userPuzzleAttemptsApiSlice.endpoints.addBulkAttempts.initiate(
          serverDataToAdd,
        ),
      )
      .catch((err) => {
        //TODO: Add better error handling
        devLog("Error bulk updating attempts:", err);
        return null;
      });
    if (isBasicSuccessResponse(serverResult)) {
      for (const result of serverResult.data) {
        //TODO: Handle errors somehow?
        if (result.isSuccess && result.newUuid) {
          idbAndReduxUuidsToUpdate.push({
            oldUuid: result.uuid,
            newUuid: result.newUuid,
          });
        }
      }
    }
    await bulkDeleteIdbAttempts(dataToDelete);
    const idbResult = await bulkAddIdbAttempts(idbDataToAdd).catch((err) => {
      //TODO: Add better error handling
      devLog("Error bulk updating IDB attempts:", err);
      return null;
    });
    if (
      idbAndReduxUuidsToUpdate.length > 0 ||
      (idbResult && idbResult.length > 0)
    ) {
      devLog("Need to sync UUIDs");
      await api.dispatch(
        syncAttemptUuids({
          serverData: idbAndReduxUuidsToUpdate,
          idbData: idbResult ?? [],
        }),
      );
    }
  },
);

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
