import { IndexableType, PromiseExtended } from "dexie";
import { ActionCreatorWithPayload, AsyncThunk } from "@reduxjs/toolkit";
import {
  RtkqMutationEndpoint,
  RtkqMutationResult,
  RtkqQueryReturnValue,
} from "@/features/api/types/rtkqTypes";

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

export type NullableDiffContainer<DataType> = {
  [key in DataSourceKeys]: DataType | null;
};

export const createNullableDiffContainer = <DataType>(
  inputIdbData?: DataType,
  inputServerData?: DataType,
): NullableDiffContainer<DataType> => {
  return { idbData: inputIdbData ?? null, serverData: inputServerData ?? null };
};

export type DiffContainer<DataType> = {
  [key in DataSourceKeys]: DataType[];
};

export const createDiffContainer = <DataType>(
  idbData: DataType[],
  serverData: DataType[],
): DiffContainer<DataType> => {
  return { idbData, serverData };
};

/** This type doesn't do anything on its own, but it uses the `isUuid` type
 * guard function, which does test for the actual UUID format.
 * @see isUuid */
export type Uuid = string;

/** The regex to determine whether a string is a valid UUID.
 * @see isUuid */
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/** Determines if an input string is a valid UUID. To return true, the string
 * must match the UUID_REGEX, i.e. hex characters [0-9a-fA-F] and dashes in the
 * pattern 8-4-4-4-12. The numbers represent the number of hex characters. The
 * string should be 36 characters in total with 4 dashes.
 * @param {string} toTest - The string to test against the regex
 */
export const isUuid = (toTest: any): toTest is Uuid => {
  if (typeof toTest !== "string") return false;
  return UUID_REGEX.test(toTest);
};

/** For use in initial state values and any other scenario where a blank, empty,
 *  or placeholder UUID is needed.
 */
export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";

/** An abstraction for use as the base of a generic type. It represents all types that contain a
 *  UUID, which is most of the types representing some unit of data that might need to be stored
 *  in IndexedDB or the server.
 * @see idbInsertWithRetry
 */
export type UuidRecord = {
  uuid: Uuid;
  [key: string]: any;
};

/** Return format for `combineUnique`, a function for merging data from IndexedDB and the server.
 * It returns an array of the combined, deduplicated data (`displayData`), as well as data that
 * needs to be added to IndexedDB and the server.
 * @see combineForDisplayAndSync
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

export type CreateDataResolverThunkArgs<DataType> = SynchronizerThunkArgs & {
  /** A string indicating which data source (server or IndexedDB) should be the source of truth
   * in case of a conflict. Should normally be "serverData" */
  primaryDataKey: DataSourceKeys;
  /** Once the server and IndexedDB data is deduplicated and merged, the resulting combined data is
   * passed to Redux for display using this reducer. */
  setDataReducer: ActionCreatorWithPayload<DataType[]>;
  /** For any data that is present in IndexedDB but not the server, it needs to be added to the
   * server. This is the endpoint for doing that. */
  addBulkServerDataEndpoint: RtkqMutationEndpoint<
    UuidRecordStatus[],
    DataType[]
  >;
  /** For any data that is present on the server but not in IndexedDB, it needs to be added to
   * IndexedDB. This is the function for doing that. */
  bulkAddIdbDataFn: (items: DataType[]) => Promise<UuidUpdateData[]>;
  bulkDeleteIdbDataFn: (uuids: Uuid[]) => PromiseExtended<void>;
  /** If there is a UUID collision when attempting to save a record in one data store, the UUID
   * will be regenerated and the save action attempted again. That change then needs to be
   * propagated to Redux and the other data store as well. This is the function for doing that. */
  syncUuidFn: AsyncThunk<void, UuidSyncData, any>;
};

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

export type UuidSyncData = {
  serverData: UuidUpdateData[];
  idbData: UuidUpdateData[];
};
