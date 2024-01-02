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
  CreateAddItemThunkArgs,
  CreateDataResolverThunkArgs,
  createDiffPromiseContainer,
  CreateSetDataFromIdbThunkArgs,
  DataSourceKeys,
  DiffContainer,
  ResolvedDataContainer,
  UuidRecord,
  UuidRecordStatus,
  UuidSyncData,
  UuidSyncFns,
  UuidUpdateData,
  UuidUpdateReducerArgs,
} from "@/features/api/types/apiTypes";
import {
  isBasicSuccessResponse,
  isErrorResponse,
  StateShape,
  Uuid,
} from "@/types";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { devLog } from "@/util";
import { RootState } from "@/app/store";
import { bulkDeleteIdbGuesses } from "@/features/guesses/api/guessesIdbApi";
import { isEqual } from "lodash";

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

/** Combines server data and IndexedDB data for a given type of record ("DataType"). The data to
 * compare comes in the form of a DiffContainer with two arrays of DataType. In the case of a
 * conflict, data from `primaryDataKey` (either "idbData" or "serverData") takes precedence.
 * Duplicates are removed by comparing UUID and any of the values for keys specified in the
 * uniqueKeys array.
 * Eventually, this function can probably be greatly simplified by using (currently experimental)
 * methods for Sets like `.union()`.
 * @param data The data from IndexedDB and the server to compare
 * @param primaryDataKey Which data (IDB or server) is the source of truth
 * @param nonUuidUniqueKeys What fields in the records aside from UUID must be unique. For example,
 *   the "text" field of a guess must be unique.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
export const combineForDisplayAndSync = <DataType extends UuidRecord>({
  data,
  primaryDataKey,
  nonUuidUniqueKeys,
}: {
  data: DiffContainer<DataType>;
  primaryDataKey: DataSourceKeys;
  nonUuidUniqueKeys?: string[];
}): ResolvedDataContainer<DataType> => {
  /** The data that takes precedence in case there's a conflict between local and server data. This
   * should normally be server data, i.e., `data.serverData`. */
  const primaryData = data[primaryDataKey];
  /** The key for the secondary data, put into its own variable to make some of the logic below
   * more readable. */
  const secondaryDataKey =
    primaryDataKey === DataSourceKeys.idbData
      ? DataSourceKeys.serverData
      : DataSourceKeys.idbData;
  /** Whichever data can be overwritten in case there's a conflict between server and IndexedDB
   * data.This should normally be the IndexedDB data, i.e., `data.idbData`. */
  const secondaryData = data[secondaryDataKey];
  /** Container for the combined, deduplicated data, to be returned and stored in Redux state */
  const displayData: DataType[] = [];
  /** Another piece of the return data. Tracks any records that are missing from the server or
   * IndexedDB so that they can be added and the data stores kept in sync. The values from the maps
   * are eventually spread into arrays, but maps are used here for easier lookup by UUID. */
  const updateMaps = {
    [DataSourceKeys.idbData]: new Map<Uuid, DataType>(),
    [DataSourceKeys.serverData]: new Map<Uuid, DataType>(),
  } as const;
  /** Final piece of the return data: A list of UUIDs that should be deleted from the secondary
   * data store because they match a unique key from the primary data but aren't identical. Some
   * records may be replaced by records from the primary data. This is necessary if, e.g., a guess
   * for the word "foobar" is stored both locally and server-side, but for some reason the UUIDs
   * don't match up. In that case, delete the local one and use the server version. */
  const dataToDelete = new Set<Uuid>();
  nonUuidUniqueKeys ??= [];
  /** The nonUuidUniqueKeys, plus "uuid", in a Set to remove duplicates */
  const uniqueKeys = new Set([...nonUuidUniqueKeys, "uuid"]);
  /** Used to track UUIDs from primary data to make it easier for the secondary data to know what
   * records the primary data is missing. */
  const uuids = new Set<Uuid>();
  /** Loops through all unique keys of all primary records. The nested loop is necessary to find
   * records in the secondary data that partially match the primary data, but aren't identical, like
   * guesses of the same word with different UUIDs, which should be removed. */
  primaryDataLoop: for (const item of primaryData) {
    for (const uniqueKey of uniqueKeys) {
      if (!(uniqueKey in item)) {
        //TODO: Add better error handling
        devLog(`Key ${uniqueKey} not present in item.`, item, data);
        continue primaryDataLoop;
      }
      const matchingItem = secondaryData.find(
        (otherItem) => otherItem[uniqueKey] === item[uniqueKey],
      );
      //If the secondary data store doesn't have the item, add it
      if (!matchingItem && !updateMaps[secondaryDataKey].has(item.uuid)) {
        updateMaps[secondaryDataKey].set(item.uuid, item);
      }
      //If `matchingItem` isn't identical to `item`, mark it for deletion and replace it with `item`
      if (matchingItem && !isEqual(item, matchingItem)) {
        dataToDelete.add(matchingItem.uuid);
        if (!updateMaps[secondaryDataKey].has(item.uuid)) {
          updateMaps[secondaryDataKey].set(item.uuid, item);
        }
      }
    }
    displayData.push(item);
    uuids.add(item.uuid);
  }
  /* Mark any records present in secondary data but missing in primary data to be added to primary
   * data. Since partial matches were already addressed in `primaryDataLoop`, this logic can be
   * much simpler. */
  for (const item of secondaryData) {
    devLog("secondary data item:", item);
    if (dataToDelete.has(item.uuid)) continue;
    if (!uuids.has(item.uuid)) {
      devLog("Don't delete item, item not present in primary data");
      displayData.push(item);
      updateMaps[primaryDataKey].set(item.uuid, item);
    }
  }
  return {
    displayData,
    idbDataToAdd: [...updateMaps[DataSourceKeys.idbData].values()],
    serverDataToAdd: [...updateMaps[DataSourceKeys.serverData].values()],
    dataToDelete: [...dataToDelete.values()],
  };
};

/** Factory function for creating a thunk that takes the records for a particular type of model from
 * IndexedDB and the server and compares them. It deduplicates and combines the data for display,
 * and syncs any records that are present in one data store but not the other. In case of a
 * conflict, the `primaryDataKey` is passed in to indicate which data should take precedence (either
 * server or IndexedDB). Normally, server data should take precedence.
 */
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

export const createSetDataFromIdbThunk = <
  DataType extends UuidRecord,
  FetchKeyType,
>({
  modelDisplayName,
  actionType,
  getIdbDataFn,
  validationFn,
  setDataReducer,
}: CreateSetDataFromIdbThunkArgs<DataType, FetchKeyType>) =>
  createAsyncThunk(actionType, async (fetchKey: FetchKeyType, api) => {
    try {
      const results = await getIdbDataFn(fetchKey);
      if (!validationFn(results)) {
        //The try/catch is already needed since getIdbDataFn can fail from Dexie's own internal
        // validation logic, so throwing an error here means that it can be handled by the same
        // catch logic, centralizing error handling in one place.
        throw new Error(
          `Invalid result type when attempting to load ${modelDisplayName} data from IndexedDB`,
        );
      }
      api.dispatch(setDataReducer(results));
    } catch (err) {
      //TODO: Add better error handling
      devLog(
        `Error when attempting to load ${modelDisplayName} data from IndexedDB:`,
        err,
      );
    }
  });

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
