/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export const usageExplanation = (frequency: number) => {
  if (frequency >= 100) return "Ubiquitous";
  if (frequency >= 10) return "Common";
  if (frequency >= 1) return "Ordinary";
  if (frequency >= 0.1) return "Uncommon";
  if (frequency >= 0.01) return "Rare";
  return "Very Rare";
};

/** Formats a word frequency value to remove some of the digits after the decimal.
 * Expects a number since the frequency is converted to a number in the transformResponse
 * method of getPuzzle in PuzzleApiSlice.
 * @param {number} frequency A frequency number value. These typically have 3-6
 *   digits after the decimal point.
 * @returns string
 */
export const formatFrequency = (frequency: number) => {
  //Just in case
  const freq = Number(frequency);
  //Return "-" for falsy values, namely NaN. It could maybe catch 0, null, or
  // undefined. Other falsy values seem unlikely.
  if (!freq) return "-";

  if (freq >= 1) return freq.toFixed(2);
  if (freq >= 0.1) return freq.toFixed(3);
  return freq.toFixed(4);
};
