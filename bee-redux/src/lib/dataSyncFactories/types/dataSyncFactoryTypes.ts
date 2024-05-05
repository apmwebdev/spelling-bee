/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ActionCreatorWithPayload, AsyncThunk } from "@reduxjs/toolkit";
import {
  RtkqMutationEndpoint,
  RtkqMutationResult,
  RtkqQueryReturnValue,
  Uuid,
} from "@/features/api";
import { IndexableType, PromiseExtended } from "dexie";
import { RootState } from "@/app/store";

export enum DataSourceKeys {
  idbData = "idbData",
  serverData = "serverData",
}

/** When comparing IDB and server data, there needs to be some way to *optionally* include the
 *  server data, since sometimes the user is a guest user and there is no server data. This
 *  object is for holding the data to compare.
 */
export type DiffPromiseContainer<ArgType, ResultType> = {
  //Returns a UUID if successful, null if unsuccessful, or a promise that resolves to one of those
  idbData: Promise<IndexableType | null> | IndexableType | null;
  //RtkqMutationResult is a promise. RtkqQueryReturnValue is the result of the promise. Either works
  serverData:
    | RtkqMutationResult<ArgType, ResultType>
    | RtkqQueryReturnValue<ResultType>
    | null;
};
export const createDiffPromiseContainer = <
  ArgType,
  ResultType,
>(): DiffPromiseContainer<ArgType, ResultType> => {
  return { idbData: null, serverData: null };
};
//TODO: Remove
export type NullableDiffContainer<DataType> = {
  [key in DataSourceKeys]: DataType | null;
};
//TODO: Remove
export const createNullableDiffContainer = <DataType>(
  inputIdbData?: DataType,
  inputServerData?: DataType,
): NullableDiffContainer<DataType> => {
  return { idbData: inputIdbData ?? null, serverData: inputServerData ?? null };
};
//Keep
export type DiffContainer<DataType> = {
  [key in DataSourceKeys]: DataType[];
};
//Maybe remove?
export const createDiffContainer = <DataType>(
  idbData: DataType[],
  serverData: DataType[],
): DiffContainer<DataType> => {
  return { idbData, serverData };
};
//TODO: Remove
export type IdbXorDiffContainer<DataType> = {
  idbData: DataType[];
  serverData?: undefined;
};
//TODO: Remove
export type ServerXorDiffContainer<DataType> = {
  idbData?: undefined;
  serverData: DataType[];
};
//TODO: Remove
export type XorDiffContainer<DataType> =
  | IdbXorDiffContainer<DataType>
  | ServerXorDiffContainer<DataType>;
//TODO: Remove
export const createXorDiffContainer = <DataType>(
  idbData: DataType[] | undefined,
  serverData: DataType[] | undefined,
): XorDiffContainer<DataType> | undefined => {
  if (Array.isArray(idbData)) return { idbData };
  if (Array.isArray(serverData)) return { serverData };
  return undefined;
};

/** An abstraction for use as the base of a generic type. It represents all types that contain a
 *  UUID, which is most of the types representing some unit of data that might need to be stored
 *  in IndexedDB or the server.
 * @see idbInsertWithRetry
 */
export type UuidRecord = {
  uuid: Uuid;
  [key: string]: any;
};

/** Return format for `getUnionAndDifferences`, a function for merging data from IndexedDB and the server.
 * It returns an array of the combined, deduplicated data (`displayData`), as well as data that
 * needs to be added to IndexedDB and the server.
 * @see getUnionAndDifferences
 */
export type ResolvedDataContainer<DataType> = {
  //TODO: If this makes everything into an array, the other containers should do that too
  /** Container for the combined, deduplicated data, to be returned and stored in Redux state */
  displayData: DataType[];
  /** Data that was present in the server data, but not in IndexedDB. Add it to IndexedDB. */
  idbDataToAdd: DataType[];
  /** Data that was present in the IndexedDB data, but not in server data. Add to server DB. */
  serverDataToAdd: DataType[];
  /** A list of UUIDs for records that conflict. Each combineUnique implementation specifies which
   * data store (IndexedDB or server DB) should take precedence in case records conflict. This
   * array is passed to the secondary data store so that the conflicting records can be overwritten
   * with data from the primary data store. This is necessary if, e.g., a guess for the word
   * "foobar" is stored both locally and server-side, but for some reason the UUIDs don't match up.
   * In that case, delete the local version and replace it with the server version. */
  dataToDelete: Uuid[];
};

export type UuidRecordStatus = {
  uuid: Uuid;
  isSuccess: boolean;
  newUuid?: Uuid;
  error?: string;
};

export type UuidUpdateData = {
  oldUuid: Uuid;
  newUuid: Uuid;
};

/** The params for the UuidUpdateReducerArgs factory function, defined here separately to make
 * documentation easier.
 * @see createUuidUpdateReducer
 */
export type UuidUpdateReducerArgs = {
  /** The model type, in a log or error message friendly format, e.g. "guess" */
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

export type SynchronizerThunkArgs = {
  /** The name of the model being analyzed, in a text-friendly form for error/log messages */
  modelDisplayName: string;
  /** The action type string for use in Redux's createAsyncThunk function. */
  actionType: string;
};

/** Common args for all factory functions that involve writing data */
export type WriterFactoryArgs<DataType> = {
  /** For any data that is present in IndexedDB but not the server, it needs to be added to the
   * server. This is the endpoint for doing that. */
  bulkAddEndpoint: RtkqMutationEndpoint<UuidRecordStatus[], DataType[]>;
  /** For any data that is present on the server but not in IndexedDB, it needs to be added to
   * IndexedDB. This is the function for doing that. */
  bulkAddIdbFn: (items: DataType[]) => Promise<UuidUpdateData[]>;
  /** If there's a conflict, the server takes precedence, so conflicting IDB data needs to be deleted. */
  bulkDeleteIdbFn: (uuids: Uuid[]) => PromiseExtended<void>;
  /** If there is a UUID collision when attempting to save a record in one data store, the UUID
   * will be regenerated and the save action attempted again. That change then needs to be
   * propagated to Redux and the other data store as well. This is the function for doing that. */
  syncUuidFn: AsyncThunk<void, UuidSyncData, any>;
};

export type CreateDataUnionThunkArgs<DataType> = SynchronizerThunkArgs &
  WriterFactoryArgs<DataType> & {
    /** A string indicating which data source (server or IndexedDB) should be the source of truth
     * in case of a conflict. Should normally be "serverData" */
    primaryDataKey: DataSourceKeys;
    /** Once the server and IndexedDB data is deduplicated and merged, the resulting combined data is
     * passed to Redux for display using this reducer. */
    setDataReducer: ActionCreatorWithPayload<DataType[]>;
    /** Keys besides UUID that should be unique. E.g., for guesses, the word itself should also be unique.*/
    nonUuidUniqueKeys?: string[];
  };

export type CreateDataMergeThunkArgs<DataType> = SynchronizerThunkArgs &
  WriterFactoryArgs<DataType> & {
    /** The source (server or IndexedDB) of the data being merged in, i.e., the source of the new data. */
    newDataSourceKey: DataSourceKeys;
    /** Reducer for merging an array of data into existing data. Has the same signature as setDataReducer,
     *  but I'm renaming it here for clarity. */
    mergeDataReducer: ActionCreatorWithPayload<DataType[]>;
    /** Selector for getting the existing (base) data that the new data will be merged into. */
    dataSelector: (state: RootState) => DataType[];
    /** Keys besides UUID that should be unique. E.g., for guesses, the word itself should also be unique.*/
    nonUuidUniqueKeys?: string[];
  };

/** Fields: idbDataToAdd, serverDataToAdd, dataToDelete, bulkAddEndpoint, bulkAddIdbFn, bulkDeleteIdbFn,
 *  syncUuidFn */
export type SyncDataThunkArgs<DataType> = Omit<
  ResolvedDataContainer<DataType>,
  "displayData"
> &
  WriterFactoryArgs<DataType> & { modelDisplayName: string };

export type CreateSetDataFromIdbThunkArgs<DataType, FetchKeyType> =
  SynchronizerThunkArgs & {
    getIdbDataFn: (key: FetchKeyType) => PromiseExtended<DataType[]>;
    validationFn: (toTest: any) => boolean;
    setDataReducer: ActionCreatorWithPayload<DataType[]>;
  };

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

export type IdbUuidSyncFn = (
  uuidData: UuidUpdateData[],
) => Promise<UuidUpdateData[]>;

export type UuidSyncFns = {
  //TODO: Fix type here
  serverUuidUpdateFn: Function;
  idbUuidUpdateFn: IdbUuidSyncFn;
  stateUuidUpdateFn: ActionCreatorWithPayload<UuidUpdateData[]>;
};
/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/
export type UuidSyncData = {
  serverData: UuidUpdateData[];
  idbData: UuidUpdateData[];
};
