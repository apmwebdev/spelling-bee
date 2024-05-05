/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

/** This type doesn't do anything on its own, but it uses the `isUuid` type
 * guard function, which does test for the actual UUID format.
 * @see isUuid */
export type Uuid = string;

/** The regex to determine whether a string is a valid UUID. Matches hex characters [0-9a-fA-F] and dashes
 *  in the pattern 8-4-4-4-12, where the numbers represent a number of hex characters. The string should
 *  be 36 characters in total with 4 dashes.
 * @see isUuid */
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const isUuid = (toTest: any): toTest is Uuid => {
  if (typeof toTest !== "string") return false;
  return UUID_REGEX.test(toTest);
};

/** For use in initial state values and other scenarios where a placeholder UUID is needed. */
export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";
