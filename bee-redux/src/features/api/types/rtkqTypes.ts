import {
  ApiEndpointMutation,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationActionCreatorResult,
  MutationDefinition,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/dist/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { SerializedError } from "@reduxjs/toolkit";
import { MutationHooks } from "@reduxjs/toolkit/dist/query/react/buildHooks";

export type RtkqQueryReturnValue<DataType> = QueryReturnValue<
  DataType, //Return type of `data` if query is successful
  FetchBaseQueryError | SerializedError //Error type if unsuccessful
>;

export type RtkqMutationDefinition<ResultType, ArgType> = MutationDefinition<
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
>;

export type RtkqMutationResult<ResultType, ArgType> =
  MutationActionCreatorResult<RtkqMutationDefinition<ResultType, ArgType>>;

export type RtkqMutationEndpoint<ResultType, ArgType> = ApiEndpointMutation<
  RtkqMutationDefinition<ResultType, ArgType>,
  {}
> &
  MutationHooks<any>;

export type RtkqQueryActionCreatorResult<ResultType, ArgType> =
  QueryActionCreatorResult<
    QueryDefinition<
      ArgType,
      (
        arg: string | FetchArgs,
        api: BaseQueryApi,
        extraOptions: {},
      ) => Promise<
        QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
      >,
      string,
      ResultType,
      "api"
    >
  >;
