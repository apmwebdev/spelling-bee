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

/** When comparing IDB and server data, there needs to be some way to *optionally* include the
 *  server data, since sometimes the user is a guest user and there is no server data. This
 *  object is for holding the data to compare.
 */
export type DataComparisonContainer<ArgType, ResultType> = {
  //Returns a UUID if successful, null if unsuccessful, or a promise that resolves to one of those
  idbData: Promise<IndexableType | null> | IndexableType | null;
  //RtkqMutationResult is a promise. RtkqQueryReturnValue is the result of the promise. Either works
  serverData:
    | RtkqMutationResult<ArgType, ResultType>
    | RtkqQueryReturnValue<ResultType>
    | null;
};

export const createDataComparisonContainer = <
  ArgType,
  ResultType,
>(): DataComparisonContainer<ArgType, ResultType> => {
  return { idbData: null, serverData: null };
};

export type NullableDiffContainer<DataType> = {
  idbData: DataType | null;
  serverData: DataType | null;
};

export const createNullableDiffContainer = <DataType>(
  inputIdbData?: DataType,
  inputServerData?: DataType,
): NullableDiffContainer<DataType> => {
  return { idbData: inputIdbData ?? null, serverData: inputServerData ?? null };
};

export type DiffContainer<DataType> = {
  idbData: DataType;
  serverData: DataType;
};

export const createDiffContainer = <DataType>(
  idbData: DataType,
  serverData: DataType,
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
