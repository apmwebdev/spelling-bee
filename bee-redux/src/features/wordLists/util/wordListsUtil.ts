/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { TGuess } from "@/features/guesses";
import { SortType } from "@/features/wordLists";
import { SortOrderKeys } from "@/types/globalTypes";

export const sortGuessList = ({
  guessList,
  sortType,
  sortOrder,
}: {
  guessList: TGuess[];
  sortType: SortType;
  sortOrder: SortOrderKeys;
}) => {
  const displayGuessList = [...guessList];
  if (sortType === SortType.Alphabetical) {
    displayGuessList.sort((a, b) => {
      if (a.text < b.text) {
        return sortOrder === SortOrderKeys.asc ? -1 : 1;
      }
      if (a.text > b.text) {
        return sortOrder === SortOrderKeys.asc ? 1 : -1;
      }
      return 0;
    });
  } else {
    displayGuessList.sort((a, b) => {
      if (sortOrder === SortOrderKeys.asc) {
        return a.createdAt - b.createdAt;
      }
      return b.createdAt - a.createdAt;
    });
  }
  return displayGuessList;
};

export const getGuessWordList = (guessList: TGuess[]) => {
  return guessList.map((guess) => guess.text);
};

export const getSortedGuessWordList = ({
  guessList,
  sortType,
  sortOrder,
}: {
  guessList: TGuess[];
  sortType: SortType;
  sortOrder: SortOrderKeys;
}) => {
  if (guessList.length === 0) return [];

  const sortedGuesses = sortGuessList({
    guessList,
    sortType,
    sortOrder,
  });
  return getGuessWordList(sortedGuesses);
};
