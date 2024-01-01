/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

/** Checks whether something is a "plain" object, since lots of things, like arrays and
 *  functions, are also technically objects. Checking whether the immediate prototype of
 *  something is Object.prototype should suffice for this. This is useful for type guard functions.
 * @param {any} toTest
 */
export function isPlainObject(toTest: any) {
  return Object.getPrototypeOf(toTest) === Object.prototype;
}

/** For type guard functions that need to check for multiple properties
 * @param {object} obj - The object to check
 * @param {string[]} properties - The property names to check in the object
 */
export function hasAllProperties(obj: object, properties: string[]) {
  //This application doesn't use object constructors or classes, so obj should be a plain object
  if (!isPlainObject(obj)) return false;
  for (const property of properties) {
    if (property in obj) continue;
    return false;
  }
  return true;
}

export enum Statuses {
  Initial = "Not Fetched",
  Pending = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

const MessageStatuses = ["Success", "Warning", "Error", "Disabled"] as const;
export type MessageStatus = (typeof MessageStatuses)[number];

export enum ColorSchemes {
  Auto = "auto",
  Light = "light",
  Dark = "dark",
}

// If either current_hint_profile_type OR current_hint_profile_id is defined,
// they both must be defined. Current_hint_profile is a polymorphic
// association in Rails, so it requires both fields.
export type UserPrefsFormData = {
  color_scheme?: ColorSchemes;
};

export type UserPrefsData = {
  colorScheme: ColorSchemes;
  // currentHintProfile: HintProfileBasicData;
};

export type StateShape<dataShape> = {
  data: dataShape;
  status: Statuses;
  error: FetchBaseQueryError | undefined;
};

export const createInitialState = <DataType>(
  data: DataType,
): StateShape<DataType> => ({
  data,
  status: Statuses.Initial,
  error: undefined,
});

export type EnumerableOption = {
  title: string;
};

export type EnumeratedOptions = {
  [key: string]: EnumerableOption;
};

export enum SortOrderKeys {
  asc = "asc",
  desc = "desc",
}

export const SortOrderOptions: EnumeratedOptions = {
  asc: { title: "Ascending" },
  desc: { title: "Descending" },
};

export type BasicResponse = {
  success: string;
};

export type BasicSuccessResponse = { data: any };

export const isBasicSuccessResponse = (
  response: any,
): response is BasicSuccessResponse => "data" in response;

export type TypedSuccessResponse<DataType> = { data: DataType };

export const isTypedSuccessResponse =
  <DataType>(validationFn: (responseData: any) => responseData is DataType) =>
  (response: any): response is TypedSuccessResponse<DataType> => {
    return isBasicSuccessResponse(response) && validationFn(response.data);
  };

export type ErrorResponse = { error: any };

export const isErrorResponse = (response: any): response is ErrorResponse =>
  "error" in response;

/** A type guard for an error type defined by RTK Query
 * @param response
 */
export const isFetchBaseQueryErrorResponse = (
  response: any,
): response is { error: FetchBaseQueryError } =>
  isErrorResponse(response) && "status" in response.error;

/** A type guard for an error type defined by RTK Query
 * @param response
 */
export const isSerializedErrorResponse = (
  response: any,
): response is { error: SerializedError } =>
  isErrorResponse(response) && !("status" in response.error);

/** All errors returned from Rails should be an object that has, at minimum, an "error" property
 *  that is a string. RTK Query then nests this error response into structures of its own.
 *  Depending on how the response is accessed, this nesting will be one or two levels.
 *  BasicError is one level of nesting and is the more refined of these nesting structures.
 *  RawBasicError is the more "raw" form of the error response and has an additional level of
 *  nesting.
 */
export type ErrorBaseData = {
  error: string;
};

export type BasicError = {
  data: ErrorBaseData;
  status: number;
};
export const isBasicError = (response: any): response is BasicError =>
  "data" in response &&
  "error" in response.data &&
  typeof response.data.error === "string";

/** When accessing an RTK Query error response directly from a query initiated with the initiate()
 *  method (i.e., not through a React hook, and `await`-ing the response), this is the
 *  minimum structure that is returned. Some errors return additional data in the
 *  error.data object, but all of them should at least return error.data.error.
 */
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

export type ActiveModelError = {
  error: string;
  activeModelErrors: { [key: string]: string[] };
};

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

/**
 * For validating email addresses submitted at sign-up
 * Copied from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
 * This mirrors the validation that browsers do on email input fields.
 * The regex essentially says that the following format is valid:
 * - One or more characters that are letters, digits, or various symbols
 * - An @ symbol
 * - 1-63 characters that are letters, numbers, or dashes. The first and last
 *   characters in this sequence can't be dashes.
 * - 0 or more instances of:
 *   - A period
 *   - 1-63 characters that are letters, numbers, or dashes. The first and last
 *     characters in this sequence can't be dashes.
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * For password validation
 * It requires that the length be 10-128 characters and include at least one of
 * each of the following:
 * - A capital letter
 * - A lowercase letter
 * - A number
 * - A non-digit, non-letter, non-whitespace character
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\sa-zA-Z]).{10,128}$/;

/** This type doesn't do anything on its own, but it uses the `isUuid` type
 * guard function, which does test for the actual UUID format.
 * @see isUuid
 */
export type Uuid = string;

/** The regex to determine whether a string is a valid UUID.
 * @see isUuid
 */
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
