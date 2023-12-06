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

/** When comparing IDB and server data, there needs to be some way to optionally include the
 *  server data, since sometimes the user is a guest user and there is no server data. You
 *  could do this by declaring a let variable and then have the server query inside of an if
 *  statement, setting the let variable to the result of the query call. But creating an object
 *  and setting the `server` property of the object to the result of the server call seems easier.
 */
export type ResultsContainer<ArgType, ResultType> = {
  //Returns a UUID if successful, null if unsuccessful, or a promise that resolves to one of those
  idb: Promise<IndexableType | null> | IndexableType | null;
  //RtkqMutationResult is a promise. RtkqQueryReturnValue is the result of the promise. Either works
  server:
    | RtkqMutationResult<ArgType, ResultType>
    | RtkqQueryReturnValue<ResultType>
    | null;
};

export const createResultsContainer = <ArgType, ResultType>(): ResultsContainer<
  ArgType,
  ResultType
> => {
  return { idb: null, server: null };
};
