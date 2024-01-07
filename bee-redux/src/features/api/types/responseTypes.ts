import {
  createTypeGuard,
  hasAllProperties,
  isPlainObject,
} from "@/types/globalTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

//Success Responses

/** Successful responses returned by RTK Query always have a `data` property. Depending on how
 *  the response is accessed, however, the data property may be nested.
 *  baseQuery responses are either SuccessResponse or ErrorResponse when accessed from apiSlice or
 *  inside an endpoint queryFn */
export type SuccessResponse = { data: any };

/** Basic type guard for a successful RTK Query response. This is necessary because the built-in
 *  ways of checking success, such as `isSuccess`, aren't always available depending on how the
 *  response is accessed.
 *  @see SuccessResponse */
export const isSuccessResponse = (response: any): response is SuccessResponse =>
  "data" in response;

/** Building on SuccessResponse, TypedSuccessResponse declares that the data property has a certain
 *  type. This is useful to satisfy TypeScript that `data` contains certain properties.
 *  @see SuccessResponse */
export type TypedSuccessResponse<DataType> = { data: DataType };

/** Factory function for creating a type guard function for a TypedSuccessResponse of a specific
 *  type.
 *  @see TypedSuccessResponse */
export const createTypedSuccessResponseTypeGuard =
  <DataType>(validationFn: (responseData: any) => responseData is DataType) =>
  (response: any): response is TypedSuccessResponse<DataType> => {
    return isSuccessResponse(response) && validationFn(response.data);
  };

//Error Responses

/** Failed responses returned by RTK Query always have an `error` property. Note that depending on
 *  how the response is accessed, the error property may be nested. */
export type ErrorResponse = { error: any };

/** Basic type guard for an RTK Query error response. This is necessary because the built-in
 *  methods for checking failure, such as `isError`, are not always available depending on how the
 *  response is accessed.
 *  @see ErrorResponse */
export const isErrorResponse = (response: any): response is ErrorResponse =>
  "error" in response;

/** All errors returned from Rails should be an object that has, at minimum, an "error" property
 *  that is a string. RTK Query then nests this error response into structures of its own.
 *  Depending on how the response is accessed, this nesting will be one or two levels.
 *  BasicError is one level of nesting and is the more refined of these nesting structures.
 *  RawBasicError is the more "raw" form of the error response and has an additional level of
 *  nesting. */
export type ErrorBaseData = {
  error: string;
};

export type BasicError = {
  data: ErrorBaseData;
  status: number;
};

export const isBasicError = (toTest: any): toTest is BasicError =>
  "data" in toTest &&
  "error" in toTest.data &&
  typeof toTest.data.error === "string";

/** When accessing an RTK Query error response directly from a query initiated with the initiate()
 *  method (i.e., not through a React hook, and `await`-ing the response), or from an endpoint
 *  queryFn, this is the minimum structure that is returned. Some errors return additional data in
 *  the error.data object, but all of them should at least return error.data.error.
 *  Structure is { error: { data: { error: string }, status: number } } */
export type RawBasicError = {
  error: BasicError;
};

export const isRawBasicError = (response: any): response is RawBasicError => {
  return "error" in response && isBasicError(response.error);
};

export type RawTypedError<ErrorType extends ErrorBaseData> = {
  error: {
    data: ErrorType;
    status: number;
  };
};

/** A curried type guard function for testing specific error structures that share a common
 *  basic structure of RawBasicError. Takes a type guard function ("errorTypeValidator") and
 *  returns a function that tests whether the response has the properties of RawBasicError, then
 *  whether the response.error.data property is the type validated by errorTypeValidator.
 * @param errorTypeValidator - Function to validate that response.error.data is the specified
 * error type.
 */
export const isRawTypedError =
  <ErrorType extends ErrorBaseData>(
    errorTypeValidator: (response: any) => response is ErrorType,
  ) =>
  (response: any): response is RawTypedError<ErrorType> => {
    return isRawBasicError(response) && errorTypeValidator(response.error.data);
  };

export type FetchBaseQueryNumberError = {
  data: any;
  status: number;
};

export const isFetchBaseQueryNumberError =
  createTypeGuard<FetchBaseQueryNumberError>(
    ["data", null],
    ["status", "number"],
  );

export type FetchBaseQueryFetchError = {
  status: "FETCH_ERROR";
  data?: undefined;
  error: string;
};

export const isFetchBaseQueryFetchError =
  createTypeGuard<FetchBaseQueryFetchError>(
    ["status", (prop: any) => prop === "FETCH_ERROR"],
    ["error", "string"],
  );

export type FetchBaseQueryParsingError = {
  status: "PARSING ERROR";
  originalStatus: number;
  data: string;
  error: string;
};

export const isFetchBaseQueryParsingError =
  createTypeGuard<FetchBaseQueryParsingError>(
    ["status", (prop: any) => prop === "PARSING_ERROR"],
    ["originalStatus", "number"],
    ["data", "string"],
    ["error", "string"],
  );

export type FetchBaseQueryCustomError = {
  status: "CUSTOM_ERROR";
  data?: unknown;
  error: string;
};

export const isFetchBaseQueryCustomError =
  createTypeGuard<FetchBaseQueryCustomError>(
    ["status", (prop: any) => prop === "CUSTOM_ERROR"],
    ["error", "string"],
  );

export type RtkqFetchBaseQueryError =
  | FetchBaseQueryNumberError
  | FetchBaseQueryFetchError
  | FetchBaseQueryParsingError
  | FetchBaseQueryCustomError;

export const isFetchBaseQueryError = (
  toTest: any,
): toTest is FetchBaseQueryError => {
  return (
    isFetchBaseQueryNumberError(toTest) ||
    isFetchBaseQueryFetchError(toTest) ||
    isFetchBaseQueryParsingError(toTest) ||
    isFetchBaseQueryCustomError(toTest)
  );
};

export type FetchBaseQueryErrorResponse = {
  error: FetchBaseQueryError & RtkqFetchBaseQueryError;
};

/** A type guard for an error type defined by RTK Query */
export const isFetchBaseQueryErrorResponse = (
  response: any,
): response is FetchBaseQueryErrorResponse => {
  if (!isErrorResponse(response)) return false;
  return isFetchBaseQueryError(response.error);
};

export const createRtkqCustomErrorResponse = ({
  data,
  error,
}: {
  data?: any;
  error: string;
}): FetchBaseQueryErrorResponse => {
  return {
    error: {
      status: "CUSTOM_ERROR",
      data,
      error,
    },
  };
};

/** A type guard for an error type defined by RTK Query */
export const isSerializedErrorResponse = (
  response: any,
): response is { error: SerializedError } =>
  isErrorResponse(response) && !("status" in response.error);

//Rails responses

export type BasicResponse = {
  success: string;
};

/** A Rails error type. Rails automatically validates certain properties of models when
 *  performing CRUD operations on them and will structure errors in the following format. */
export type ActiveModelError = {
  error: string;
  activeModelErrors: { [key: string]: string[] };
};

/** @see ActiveModelError */
export const isActiveModelError = (
  response: any,
): response is ActiveModelError => {
  if (!hasAllProperties(response, ["error", "activeModelErrors"])) return false;
  if (!(typeof response.error === "string")) return false;
  if (!isPlainObject(response.activeModelErrors)) return false;
  return true;
};

export type RawActiveModelError = RawTypedError<ActiveModelError>;

export const isRawActiveModelError =
  isRawTypedError<ActiveModelError>(isActiveModelError);
