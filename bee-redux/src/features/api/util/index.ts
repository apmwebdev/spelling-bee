/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export * from "./debouncer";
export * from "./persistor";

export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

type AnyObject = {
  [key: string | number | symbol]: any;
};

const isPlainObject = (thing: any) => thing?.constructor === Object;

export const keysToSnakeCase = (obj?: AnyObject) => {
  if (obj === undefined) return obj;
  const newObject: AnyObject = {};
  for (const key in obj) {
    const newKey = toSnakeCase(key);
    newObject[newKey] = isPlainObject(obj[key])
      ? keysToSnakeCase(obj[key])
      : obj[key];
  }
  return newObject;
};

/** The regex to determine whether a string is a valid UUID.
 * @see isValidUuid
 */
export const UUID_REGEX =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

/** Determines if an input string is a valid UUID. To return true, the string
 * must match the UUID_REGEX, i.e. hex characters [0-9a-fA-F] and dashes in the
 * pattern 8-4-4-4-12. The numbers represent the number of hex characters. The
 * string should be 36 characters in total with 4 dashes.
 * @param {string} to_test - The string to test against the regex
 */
export const isValidUuid = (to_test: string) => to_test.match(UUID_REGEX);

/** For use in initial state values and any other scenario where a blank, empty,
 *  or placeholder UUID is needed.
 */
export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";
