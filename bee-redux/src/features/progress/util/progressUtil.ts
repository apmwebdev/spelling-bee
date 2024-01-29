/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export const processPercentString = (val: number) => {
  const formatPercentString = (val: number) => {
    if (Number.isNaN(val)) return "0";
    const formattedVal = val.toFixed(2);
    if (formattedVal.slice(-2) === "00") return formattedVal.slice(0, -3);
    return formattedVal;
  };

  return formatPercentString(val) + "%";
};
