/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Uuid } from "@/features/api/types/apiTypes";
import { StateShape } from "@/types/globalTypes";
import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { devLog, errLog } from "@/util";
import { RootState } from "@/app/store";
import { isEqual } from "lodash";
import {
  isErrorResponse,
  isSuccessResponse,
} from "@/features/api/types/responseTypes";
import {
  CreateAddItemThunkArgs,
  CreateDataMergeThunkArgs,
  CreateDataUnionThunkArgs,
  createDiffPromiseContainer,
  CreateSetDataFromIdbThunkArgs,
  DataSourceKeys,
  DiffContainer,
  ResolvedDataContainer,
  SyncDataThunkArgs,
  UuidRecord,
  UuidRecordStatus,
  UuidSyncData,
  UuidSyncFns,
  UuidUpdateData,
  UuidUpdateReducerArgs,
} from "@/lib/dataSyncFactories/types/dataSyncFactoryTypes";

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

const getOtherDataSourceKey = (baseKey: DataSourceKeys) => {
  return baseKey === DataSourceKeys.idbData
    ? DataSourceKeys.serverData
    : DataSourceKeys.idbData;
};

/** Given two deduplicated arrays of type <DataType[]>, return the union and differences for this data. One
 *  of the sources is designated as the source of truth in case of partially matching records. Records are
 *  compared using UUID and any other designated unique keys.
 * @template DataType extends UuidRecord (i.e., DataType must contain a UUID field)
 * @param {DiffContainer<DataType>} data The container for the data. One array is server data and the
 * other is from IndexedDB.
 * @param primaryDataKey Which data (IDB or server) is the source of truth in case of a conflicting record. A
 * conflicting record is one where a unique key matches but the records are not identical.
 * @param mode If "UNION", return the union of the data in the return object's displayData property (and
 * then set the state to that directly in the calling function). If "MERGE", set displayData to the
 * diff of secondaryData and primaryData (to be merged into state in the calling function).
 * @param nonUuidUniqueKeys What fields in the records aside from UUID must be unique. For example, the
 *  "text" field of a guess must be unique since you can't guess the same word more than once.
 * @returns {ResolvedDataContainer<DataType>} Contains the union and both A\B and B\A difference, as well
 * as the UUIDs of any conflicting records to be deleted from the secondary data store.
 */
export const getUnionAndDifferences = <DataType extends UuidRecord>({
  data,
  primaryDataKey,
  mode,
  nonUuidUniqueKeys,
}: {
  data: DiffContainer<DataType>;
  primaryDataKey: DataSourceKeys;
  mode: "UNION" | "MERGE";
  nonUuidUniqueKeys?: string[];
}): ResolvedDataContainer<DataType> => {
  devLog(
    "data:",
    data,
    `primaryDataKey: ${primaryDataKey}`,
    `mode: ${mode}`,
    `nonUuidUniqueKeys: ${nonUuidUniqueKeys}`,
  );
  /** The source of truth. Should normally be server data, i.e., `data.serverData`. */
  const primaryData = data[primaryDataKey];
  const secondaryDataKey = getOtherDataSourceKey(primaryDataKey);
  /** The not-source-of-truth. Should normally be the IndexedDB data, i.e., `data.idbData`. */
  const secondaryData = data[secondaryDataKey];
  const displayData: DataType[] = [];
  const updateMaps = {
    [DataSourceKeys.idbData]: new Map<Uuid, DataType>(),
    [DataSourceKeys.serverData]: new Map<Uuid, DataType>(),
  } as const;
  const dataToDelete = new Set<Uuid>();
  nonUuidUniqueKeys ??= [];
  const uniqueKeys = new Set([...nonUuidUniqueKeys, "uuid"]);
  /** Track UUIDs from primary data so secondary data can add any missing UUIDs. */
  const uuids = new Set<Uuid>();
  /** Loops through all unique keys of all primary records. The nested loop is necessary to find
   * records in the secondary data that partially match the primary data, but aren't identical, like
   * guesses of the same word with different UUIDs, which should be removed. */
  primaryDataLoop: for (const primaryItem of primaryData) {
    for (const uniqueKey of uniqueKeys) {
      if (!(uniqueKey in primaryItem)) {
        //TODO: Add better error handling?
        errLog(
          `Expected key "${uniqueKey}" not present in primaryItem.`,
          primaryItem,
          data,
        );
        continue primaryDataLoop;
      }
      const secondaryItem = secondaryData.find(
        (item) => item[uniqueKey] === primaryItem[uniqueKey],
      );
      if (
        !secondaryItem &&
        !updateMaps[secondaryDataKey].has(primaryItem.uuid)
      ) {
        //If secondaryData doesn't have primaryItem, add it
        updateMaps[secondaryDataKey].set(primaryItem.uuid, primaryItem);
      } else if (secondaryItem && !isEqual(primaryItem, secondaryItem)) {
        // If secondaryItem exists and isn't equal to primaryItem, replace it with primaryItem
        dataToDelete.add(secondaryItem.uuid);
        if (!updateMaps[secondaryDataKey].has(primaryItem.uuid)) {
          updateMaps[secondaryDataKey].set(primaryItem.uuid, primaryItem);
        }
      }
    }
    if (mode === "UNION") displayData.push(primaryItem);
    uuids.add(primaryItem.uuid);
  }
  /* Mark any records present in secondary data but missing in primary data to be added to primary data.
   Since partial matches were already addressed in `primaryDataLoop`, this logic can be much simpler. */
  for (const item of secondaryData) {
    if (dataToDelete.has(item.uuid)) continue;
    if (!uuids.has(item.uuid)) {
      displayData.push(item);
      updateMaps[primaryDataKey].set(item.uuid, item);
    }
  }
  if (mode === "MERGE") {
    displayData.push(...updateMaps[secondaryDataKey].values());
  }
  const returnValue: ResolvedDataContainer<DataType> = {
    displayData,
    idbDataToAdd: [...updateMaps[DataSourceKeys.idbData].values()],
    serverDataToAdd: [...updateMaps[DataSourceKeys.serverData].values()],
    dataToDelete: [...dataToDelete.values()],
  };
  devLog("returnValue:", returnValue);
  return returnValue;
};

/** Factory function for creating a thunk that takes the records for a particular type of model from
 * IndexedDB and the server and compares them. It deduplicates and combines the data for display,
 * and syncs any records that are present in one data store but not the other. In case of a
 * conflict, the `primaryDataKey` is passed in to indicate which data should take precedence (either
 * server or IndexedDB). Normally, server data should take precedence.
 */
export const createDataUnionThunk = <DataType extends UuidRecord>({
  modelDisplayName,
  actionType,
  primaryDataKey,
  setDataReducer,
  bulkAddEndpoint,
  bulkAddIdbFn,
  bulkDeleteIdbFn,
  syncUuidFn,
  nonUuidUniqueKeys,
}: CreateDataUnionThunkArgs<DataType>) =>
  createAsyncThunk(actionType, async (data: DiffContainer<DataType>, api) => {
    const { displayData, idbDataToAdd, serverDataToAdd, dataToDelete } =
      getUnionAndDifferences({
        data,
        primaryDataKey,
        mode: "UNION",
        nonUuidUniqueKeys,
      });

    api.dispatch(setDataReducer(displayData));
    api.dispatch(
      syncDataThunk<DataType>()({
        modelDisplayName,
        idbDataToAdd,
        serverDataToAdd,
        dataToDelete,
        bulkAddEndpoint,
        bulkAddIdbFn,
        bulkDeleteIdbFn,
        syncUuidFn,
      }),
    );
  });

/** Merges data from one data source (server or IDB) into current state, assuming data from the other
 *  data source has already been loaded. This is different from createDataUnionThunk because, in that
 *  scenario, the data is being combined via a union operation and then added to state, whereas here one of
 *  the data sources has already been added to state and the other is being merged into it.
 */
export const createDataMergeThunk = <DataType extends UuidRecord>({
  modelDisplayName,
  actionType,
  bulkAddEndpoint,
  bulkAddIdbFn,
  bulkDeleteIdbFn,
  syncUuidFn,
  nonUuidUniqueKeys,
  newDataSourceKey,
  mergeDataReducer,
  dataSelector,
}: CreateDataMergeThunkArgs<DataType>) =>
  createAsyncThunk(actionType, (newData: DataType[], api) => {
    const state = api.getState() as RootState;
    const baseData = dataSelector(state);
    const dataToCompare: DiffContainer<DataType> =
      newDataSourceKey === DataSourceKeys.serverData
        ? { idbData: baseData, serverData: newData }
        : { idbData: newData, serverData: baseData };

    const { displayData, idbDataToAdd, serverDataToAdd, dataToDelete } =
      getUnionAndDifferences({
        data: dataToCompare,
        primaryDataKey: getOtherDataSourceKey(newDataSourceKey),
        mode: "MERGE",
        nonUuidUniqueKeys,
      });
    api.dispatch(mergeDataReducer(displayData));
    // This is async, but don't wait for it; let it run in the background
    api.dispatch(
      syncDataThunk<DataType>()({
        modelDisplayName,
        idbDataToAdd,
        serverDataToAdd,
        dataToDelete,
        bulkAddEndpoint,
        bulkAddIdbFn,
        bulkDeleteIdbFn,
        syncUuidFn,
      }),
    );
  });

/** Note that this is curried so the generic can be passed in. You need to dispatch the returned thunk, e.g.:
 * const results = dispatch(syncDataThunk<TAttempt>()(someArg)); */
export const syncDataThunk = <DataType extends UuidRecord>() =>
  createAsyncThunk(
    "dataSync/syncDataThunk",
    async (
      {
        modelDisplayName,
        idbDataToAdd,
        serverDataToAdd,
        dataToDelete,
        bulkAddEndpoint,
        bulkAddIdbFn,
        bulkDeleteIdbFn,
        syncUuidFn,
      }: SyncDataThunkArgs<DataType>,
      api,
    ) => {
      const idbAndReduxUuidsToUpdate: UuidUpdateData[] = [];
      if (serverDataToAdd.length > 0) {
        const serverResult = await api
          .dispatch(bulkAddEndpoint.initiate(serverDataToAdd))
          .catch((err) => {
            //TODO: Add better error handling
            errLog(`Error bulk updating ${modelDisplayName}:`, err);
            return null;
          });
        devLog("serverResult:", serverResult);
        if (isSuccessResponse(serverResult)) {
          for (const result of serverResult.data) {
            //TODO: Handle errors somehow?
            if (result.isSuccess && result.newUuid) {
              devLog("newUuid:", result);
              idbAndReduxUuidsToUpdate.push({
                oldUuid: result.uuid,
                newUuid: result.newUuid,
              });
            }
          }
        }
      }
      if (dataToDelete.length > 0) {
        await bulkDeleteIdbFn(dataToDelete);
      }
      let idbResult: UuidUpdateData[] | null = null;
      if (idbDataToAdd.length > 0) {
        idbResult = await bulkAddIdbFn(idbDataToAdd).catch((err) => {
          //TODO: Add better error handling
          errLog(`Error bulk updating IDB ${modelDisplayName}:`, err);
          return null;
        });
        devLog("idbResult:", idbResult);
      }
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
    },
  );

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
        /* The try/catch is already needed since getIdbDataFn can fail from Dexie's own internal
         * validation logic, so throwing an error here means that it can be handled by the same
         * catch logic, centralizing error handling in one place. */
        throw new Error(
          `Invalid result type when attempting to load ${modelDisplayName} data from IndexedDB`,
        );
      }
      api.dispatch(setDataReducer(results));
    } catch (err) {
      //TODO: Add better error handling
      errLog(
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
    devLog("addItemThunk:", itemToAdd);
    if (!validationFn(itemToAdd)) {
      //TODO: Add better error handling
      errLog(`Invalid ${itemDisplayType}. Exiting.`, itemToAdd);
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
      errLog(`Couldn't save ${itemDisplayType} locally or remotely. Deleting.`);
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
