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
  createDiffPromiseContainer,
  DataSourceKeys,
  DiffContainer,
  RtkqMutationEndpoint,
  UuidRecord,
  UuidRecordStatus,
  UuidUpdateData,
} from "@/features/api/types";
import {
  isBasicSuccessResponse,
  isErrorResponse,
  StateShape,
  Uuid,
} from "@/types";
import {
  ActionCreatorWithPayload,
  AsyncThunk,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { devLog } from "@/util";
import { IndexableType } from "dexie";
import { RootState } from "@/app/store";
import { combineForDisplayAndSync } from "@/features/api";
import { bulkDeleteIdbGuesses } from "@/features/guesses/api/guessesIdbApi";

/** The params for the UuidUpdateReducerArgs factory function, defined here separately to make
 * documentation easier.
 * @see createUuidUpdateReducer
 */
export type UuidUpdateReducerArgs = {
  /** The model type, in a log or error message friendly format? E.g. "guess" */
  modelDisplayName: string;
  /** In order to find the array of models where the UUIDs need to be updated, it may be necessary
   * to provide the path (in the form of keys) to that array for each individual slice.
   *
   * This is necessary because different slices have different state shapes. While all slices have a
   * `data` property, and all the slices used for createUuidUpdateReducer have an array of models
   * somewhere in `data`, some slices have the model array more deeply nested. If this param is
   * absent, it means that the array is not nested (i.e., `state.data` is the array).
   */
  keyPathToModels?: string[];
};

/** This is a factory function for creating a Redux reducer for updating UUIDs, as the logic for
 * updating UUIDs in Redux is almost identical across model types/slices. This is necessary because
 * if there is a UUID collision when trying to persist a model to IndexedDB or Postgres, the app
 * tries to generate a new UUID and save the model again. If this is successful, the new UUID then
 * needs to be propagated to Redux and the other persistent store so that the UUIDs stay in sync.
 * @see UuidUpdateReducerArgs
 */
export const createUuidUpdateReducer =
  <DataShape>({ modelDisplayName, keyPathToModels }: UuidUpdateReducerArgs) =>
  (
    state: StateShape<DataShape>,
    { payload }: PayloadAction<UuidUpdateData[]>,
  ) => {
    let modelArray: any = state.data;
    if (keyPathToModels && keyPathToModels.length > 0) {
      for (const key of keyPathToModels) {
        if (!(key in modelArray)) break;
        modelArray = modelArray[key];
      }
    }
    if (!Array.isArray(modelArray)) {
      //TODO: Add better error handling
      devLog(
        `Can't update UUIDs: Invalid path to ${modelDisplayName} array.`,
        modelArray,
      );
      return;
    }
    for (const item of payload) {
      const modelToUpdate = modelArray.find(
        (model) => model.uuid === item.oldUuid,
      );
      if (!modelToUpdate) continue;
      modelToUpdate.uuid = item.newUuid;
    }
  };

export type CreateDataResolverThunkArgs<DataType> = {
  modelDisplayName: string;
  actionType: string;
  primaryDataKey: DataSourceKeys;
  setDataReducer: ActionCreatorWithPayload<DataType[]>;
  addBulkServerDataEndpoint: RtkqMutationEndpoint<
    UuidRecordStatus[],
    DataType[]
  >;
  addBulkIdbData: (items: DataType[]) => Promise<UuidUpdateData[]>;
  syncUuidFn: AsyncThunk<void, UuidSyncData, any>;
};

export const createDataResolverThunk = <DataType extends UuidRecord>({
  modelDisplayName,
  actionType,
  primaryDataKey,
  setDataReducer,
  addBulkServerDataEndpoint,
  addBulkIdbData,
  syncUuidFn,
}: CreateDataResolverThunkArgs<DataType>) =>
  createAsyncThunk(actionType, async (data: DiffContainer<DataType>, api) => {
    const { displayData, idbDataToAdd, serverDataToAdd, dataToDelete } =
      combineForDisplayAndSync({
        data,
        primaryDataKey,
        //TODO: Add other unique keys
      });
    api.dispatch(setDataReducer(displayData));
    const idbAndReduxUuidsToUpdate: UuidUpdateData[] = [];
    const serverResult = await api
      .dispatch(addBulkServerDataEndpoint.initiate(serverDataToAdd))
      .catch((err) => {
        //TODO: Add better error handling
        devLog(`Error bulk updating ${modelDisplayName}:`, err);
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
    await bulkDeleteIdbGuesses(dataToDelete);
    const idbResult = await addBulkIdbData(idbDataToAdd).catch((err) => {
      //TODO: Add better error handling
      devLog(`Error bulk updating IDB ${modelDisplayName}:`, err);
      return null;
    });
    if (
      idbAndReduxUuidsToUpdate.length > 0 ||
      (idbResult && idbResult.length > 0)
    ) {
      devLog("Need to sync UUIDs");
      await api.dispatch(
        syncUuidFn({
          serverData: idbAndReduxUuidsToUpdate,
          idbData: idbResult ?? [],
        }),
      );
    }
  });

export type CreateAddItemThunkArgs<DataType> = {
  itemDisplayType: string;
  actionType: string;
  validationFn: (toTest: any) => boolean;
  addItemReducer: ActionCreatorWithPayload<DataType>;
  deleteItemReducer: ActionCreatorWithPayload<Uuid>;
  addIdbItemFn: (
    record: DataType,
    retryCount?: number,
  ) => Promise<IndexableType | null>;
  addServerItemEndpoint: RtkqMutationEndpoint<DataType, DataType>;
};

export const createAddItemThunk = <DataType extends UuidRecord>({
  itemDisplayType,
  actionType,
  validationFn,
  addItemReducer,
  deleteItemReducer,
  addIdbItemFn,
  addServerItemEndpoint,
}: CreateAddItemThunkArgs<DataType>) =>
  createAsyncThunk(actionType, async (itemToAdd: DataType, api) => {
    //do stuff
    if (!validationFn(itemToAdd)) {
      //TODO: Add better error handling
      devLog(`Invalid ${itemDisplayType}. Exiting.`, itemToAdd);
      return;
    }
    const state = api.getState() as RootState;
    const originalUuid = itemToAdd.uuid;
    api.dispatch(addItemReducer(itemToAdd));
    const results = createDiffPromiseContainer<DataType, DataType>();
    results.idbData = await addIdbItemFn(itemToAdd);
    if (!state.auth.isGuest) {
      results.serverData = await api.dispatch(
        addServerItemEndpoint.initiate(itemToAdd),
      );
    }
    //If neither DB saved the attempt, remove it from Redux as well
    if (
      results.idbData === null &&
      (isErrorResponse(results.serverData) || results.serverData === null)
    ) {
      //TODO: Add better error handling
      devLog(`Couldn't save ${itemDisplayType} locally or remotely. Deleting.`);
      api.dispatch(deleteItemReducer(originalUuid));
      return;
    }
    //TODO: Check UUIDs to make sure they match in all places
  });

export type IdbUuidSyncFn = (
  uuidData: UuidUpdateData[],
) => Promise<UuidUpdateData[]>;

export type UuidSyncFns = {
  //TODO: Fix type here
  serverUuidUpdateFn: Function;
  idbUuidUpdateFn: IdbUuidSyncFn;
  stateUuidUpdateFn: ActionCreatorWithPayload<UuidUpdateData[]>;
};

export type UuidSyncData = {
  serverData: UuidUpdateData[];
  idbData: UuidUpdateData[];
};

//TODO: Make this recursive or a loop so it will keep trying new UUIDs until one works in both
// places
export const createUuidSyncThunk = ({
  serverUuidUpdateFn,
  idbUuidUpdateFn,
  stateUuidUpdateFn,
}: UuidSyncFns) => {
  return createAsyncThunk(
    "synchronizer/syncUuids",
    async ({ serverData, idbData }: UuidSyncData, api) => {
      const serverResults = await api.dispatch(serverUuidUpdateFn(serverData));
      const idbResults = await idbUuidUpdateFn(idbData);
      if (serverResults === idbResults) devLog("blah");
    },
  );
};

export const syncRecords = async ({
  serverData,
  serverBulkSaveFn,
  idbData,
  idbBulkSaveFn,
  bulkDeleteData,
  bulkDeleteFn,
}: {
  serverData: UuidRecord[];
  serverBulkSaveFn: (serverData: UuidRecord[]) => UuidRecordStatus[];
  idbData: UuidRecord[];
  idbBulkSaveFn: (idbData: UuidRecord[]) => UuidRecordStatus[];
  bulkDeleteData: Uuid[];
  bulkDeleteFn: (bulkDeleteData: Uuid[]) => UuidRecordStatus[];
}) => {
  const serverResults = await serverBulkSaveFn(serverData);
  const deletionResults = await bulkDeleteFn(bulkDeleteData);
  const idbResults = await idbBulkSaveFn(idbData);
};
