import { IndexableType } from "dexie";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationActionCreatorResult,
  MutationDefinition,
} from "@reduxjs/toolkit/query";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { Uuid } from "@/types";

export type RtkqQueryReturnValue<DataType> = QueryReturnValue<
  DataType, //Return type of `data` if query is successful
  FetchBaseQueryError | SerializedError //Error type if unsuccessful
>;

export type RtkqMutationResult<ArgType, ResultType> =
  MutationActionCreatorResult<
    MutationDefinition<
      ArgType,
      (
        arg: string | FetchArgs,
        api: BaseQueryApi,
        extraOptions: {},
      ) => Promise<
        QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
      >,
      string, //Tag type
      ResultType,
      "api" //Reducer path
    >
  >;

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

/** An abstraction for use as the base of a generic type. It represents all types that contain a
 *  UUID, which is most of the types representing some unit of data that might need to be stored
 *  in IndexedDB or the server.
 * @see idbInsertWithRetry
 */
export type UuidRecord = {
  uuid: Uuid;
  [key: string]: any;
};

/** This type is the return format for combineUnique, a function for merging data from IndexedDB and
 * the server for display. `displayData` is the combined data for storing in Redux and displaying.
 * `idbUpdateData` is data that was present on the server but not in IndexedDB, so the data needs to
 * be added to IndexedDB. `serverUpdateData` is the opposite: Data that was present in IndexedDB but
 * not on the server, so it needs to be added to the server.
 * @see combineForDisplayAndSync
 */
export type ResolvedDataContainer<DataType> = {
  //TODO: If this makes everything into an array, the other containers should do that too
  displayData: DataType[];
  idbDataToAdd: DataType[];
  serverDataToAdd: DataType[];
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
