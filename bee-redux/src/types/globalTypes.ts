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
export function hasAllProperties(
  obj: object,
  properties: string[] | IterableIterator<string>,
) {
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

/** The different ways to validate a property in createTypeGuard:
 *  1. If the validator is null, the property only needs to exist in the object to be valid
 *  2. If the validator is a string, the property needs to be the typeof that string
 *  3. If the validator is a predicate or type guard function, that function validates the property
 *     and needs to return true when passed the property as an argument. */
export type TypeGuardPropertyValidator =
  | null
  | string
  | ((toTest: any) => toTest is any)
  | ((toTest: any) => boolean);

/** A factory function to make creating type guards easier. Give it an array of properties +
 * validation for those properties (`validators`) to create the type guard function, then pass
 * an object (`toTest`) to the created type guard to type check that object.
 * @param validators An array of tuples with the properties of the type being tested. The first
 * item in the tuple is the name of the property. The second item is the validation for that
 * property. This array of tuples is then turned into a Map for ease of use.
 * */
export const createTypeGuard = <ValidType>(
  ...validators: Array<[string, TypeGuardPropertyValidator]>
) => {
  const validProperties = new Map<string, TypeGuardPropertyValidator>(
    validators,
  );
  return (toTest: any): toTest is ValidType => {
    //This app doesn't use object constructors or classes, so toTest should be a plain object
    if (!isPlainObject(toTest)) return false;
    if (!hasAllProperties(toTest, validProperties.keys())) return false;
    for (const [key, value] of validProperties) {
      if (typeof value === "string") {
        if (!(typeof toTest[key] === value)) return false;
      } else if (typeof value === "function") {
        if (!value(toTest[key])) return false;
      }
    }
    return true;
  };
};

export const isEmptyArray = (toTest: any) => {
  return Array.isArray(toTest) && toTest.length === 0;
};

export const isPopulatedArray = (toTest: any) => {
  return Array.isArray(toTest) && toTest.length > 0;
};

export const isPromiseSettledResult = (
  toTest: any,
): toTest is PromiseSettledResult<any> => {
  if (!("status" in toTest)) return false;
  if (toTest.status !== "fulfilled" && toTest.status !== "rejected") {
    return false;
  }
  if (toTest.status === "fulfilled" && !("value" in toTest)) return false;
  if (toTest.status === "rejected" && !("reason" in toTest)) return false;
  return true;
};

export const isRejectedPromiseSettled = (toTest: any) => {
  return isPromiseSettledResult(toTest) && toTest.status === "rejected";
};
