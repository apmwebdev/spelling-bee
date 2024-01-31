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
import { errLog } from "@/util";

/** Checks whether something is a "plain" object, since lots of things, like arrays and
 *  functions, are also technically objects. Checking whether the immediate prototype of
 *  something is Object.prototype should suffice for this. This is useful for type guard functions.
 * @param {any} toTest
 */
export function isPlainObject(toTest: any) {
  if (toTest === null || typeof toTest !== "object") {
    return false;
  }
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
  if (obj === null || !(typeof obj === "object")) return false;
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

/** There are multiple places where lists of answers, guesses, etc. can be custom sorted by the
 * end user. In all of these places, whether to sort in ascending order or descending order is part
 * of the sorting options, so it makes sense to have a global way to define this.
 * SortOrderKeys.asc = "asc" (Ascending)
 * SortOrderKeys.desc = "desc" (Descending)
 */
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

/** Base types for use in the createTypeGuard function that can be checked with typeof.
 * @see createTypeGuard
 */
export type TypeGuardBaseTypes =
  | "boolean"
  | "string"
  | "number"
  | "bigint"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

/** For use in createTypeGuard as a validator function. Checks if a property is one of the values
 * in an enum, since these are compiled down to regular objects.
 * @param {object} enumObj The enum to check against. The enum's keys will be the object's keys,
 *   and its values will be the object's values.
 * @see createTypeGuard
 */
export const isEnumValue = (enumObj: object) => {
  return (val: any): boolean => {
    return Object.values(enumObj).includes(val);
  };
};

/** The different ways to validate a property in createTypeGuard:
 *  1. If the validator is null, the property only needs to exist in the object to be valid
 *  2. If the validator is a string from TypeGuardBaseTypes, the property needs to be the typeof
 *     that string.
 *  3. If the validator is a predicate or type guard function, that function validates the property
 *     and needs to return true when passed the property as an argument.
 */
type TypeValidatorBase =
  | null
  | TypeGuardBaseTypes
  | ((toTest: any) => toTest is any)
  | ((toTest: any) => boolean);

/** Type predicate for TypeValidatorBase.
 * @see TypeValidatorBase
 */
export const isTypeValidatorBase = (
  toTest: any,
): toTest is TypeValidatorBase => {
  return (
    toTest === null ||
    typeof toTest === "string" ||
    typeof toTest === "function"
  );
};

/** A container that holds a TypeValidatorBase as well as additional options for type checking with
 * that base validator.
 */
type TypeValidatorWithOptions = {
  validator: TypeValidatorBase;
  /** When true, a property must pass validation with `validator` only if it is present in the
   * object. I.e.: For a property with key `key` in object `obj`, `!(key in obj)` is valid.
   * Note that this doesn't mean that the property can be null or undefined if it IS present.
   */
  isOptional: boolean;
};

export const isTypeValidatorWithOptions = (
  toTest: any,
): toTest is TypeValidatorWithOptions => {
  if (!isPlainObject(toTest)) return false;
  return (
    hasAllProperties(toTest, ["validator", "isOptional"]) &&
    isTypeValidatorBase(toTest.validator) &&
    typeof toTest.isOptional === "boolean"
  );
};

export type TypeValidator = TypeValidatorBase | TypeValidatorWithOptions;

/** A factory function to make creating type guards easier. Give it an array of properties +
 * validation for those properties (`validators`) to create the type guard function, then pass
 * an object (`toTest`) to the created type guard to type check that object.
 * @param validators An array of tuples with the properties of the type being tested. The first
 * item in the tuple is the name of the property. The second item is the validation for that
 * property.
 * */
export const createTypeGuard = <ValidType>(
  ...validators: [string, TypeValidator][]
) => {
  //The factory function

  //Reusable function for testing a prop and validator. This is defined here, but only used in the
  // returned type guard function, below.
  const propIsValid = ({
    validator,
    prop,
  }: {
    validator: TypeValidator;
    prop: any;
  }) => {
    if (typeof validator === "string") {
      //If the validator is a string, the prop must be the `typeof` that string
      if (!(typeof prop === validator)) return false;
    } else if (typeof validator === "function") {
      if (!validator(prop)) return false;
    }
    return true;
  };

  const errorBase = "Custom type guard error";
  const invalidate = (...toLog: any[]) => {
    errLog(errorBase, ...toLog);
  };

  //The generated type guard function
  return (toTest: any): toTest is ValidType => {
    //This app doesn't use object constructors or classes, so toTest should be a plain object
    if (!isPlainObject(toTest)) {
      invalidate("toTest isn't a plain object:", toTest);
      return false;
    }
    for (const [key, value] of validators) {
      if (isTypeValidatorWithOptions(value) && !value.isOptional) {
        if (!(key in toTest)) {
          invalidate(`Missing key ${key}`);
          return false;
        }
        if (value.validator === null) continue;
        if (
          !propIsValid({
            validator: value.validator,
            prop: toTest[key],
          })
        ) {
          invalidate(`${key} is invalid:`, toTest[key]);
          return false;
        }
      } else if (isTypeValidatorWithOptions(value) && value.isOptional) {
        if (
          key in toTest &&
          !propIsValid({
            validator: value.validator,
            prop: toTest[key],
          })
        ) {
          invalidate(`${key} is invalid:`, toTest[key]);
          return false;
        }
      } else {
        if (!(key in toTest)) {
          invalidate(`Missing key ${key}`);
          return false;
        }
        if (value === null) continue;
        if (
          !propIsValid({
            validator: value,
            prop: toTest[key],
          })
        ) {
          invalidate(`${key} is invalid:`, toTest[key]);
          return false;
        }
      }
    }
    //If we got here, none of the properties failed validation. Object is valid.
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
