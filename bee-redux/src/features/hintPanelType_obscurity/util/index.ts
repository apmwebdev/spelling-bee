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
  if (frequency >= 10) return "Very Common";
  if (frequency >= 1) return "Common";
  if (frequency >= 0.1) return "Uncommon";
  if (frequency >= 0.01) return "Obscure";
  return "Very Obscure";
};
