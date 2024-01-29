/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { random, shuffle } from "lodash";
import { SortOrderKeys } from "@/types/globalTypes";

/**
 * Cases
 * Remaining and spoiled only: 7 cases
 *  First letter, length: 2 cases. order
 *  First letter, no length: 2 cases. order
 *  Length, no first letter: 2 cases. order
 *  No first letter, no length: 1 case.
 *
 * Not grouped with first letter: 14 cases.
 *  No first letter, no length: 4 cases. location x order (order matters for found answers)
 *  First letter, no length: 4 cases. location x order
 *  Length, no first letter: 4 cases. location x order
 *  First letter and length: 4 cases. location x order
 *
 * Grouped with first letter: 6 cases.
 *  No length: 4 cases. location x order (order matters for letters)
 *  Length: 4 cases. location x order
 */
type LetterGrouperCell = {
  known: string[];
  unknown: string[];
};

type LetterGrouperFormat = {
  [letter: string]: LetterGrouperCell;
};

//Function assumes all arrays are already sorted using default sort
type answerSorterParams = {
  remainingWords: string[];
  knownWords: string[];
  spoiledWords: string[];
  validLetters: string[];
  sortOrder: SortOrderKeys;
  remainingAndSpoiledOnly: boolean;
  remainingRevealFirstLetter: boolean;
  remainingRevealLength: boolean;
  remainingLocation: "beginning" | "end";
  remainingGroupWithFirstLetter: boolean;
};

export default function answerSorter({
  remainingWords,
  knownWords,
  spoiledWords,
  validLetters,
  sortOrder,
  remainingAndSpoiledOnly,
  remainingRevealFirstLetter,
  remainingRevealLength,
  remainingLocation,
  remainingGroupWithFirstLetter,
}: answerSorterParams) {
  const flSort = (a: string, b: string) => {
    return a[0].localeCompare(b[0]);
  };

  const lengthSort = (a: string, b: string) => {
    return a.length - b.length;
  };

  const letterGrouper = (): LetterGrouperFormat => {
    const grouper: LetterGrouperFormat = {};
    for (const letter of validLetters) {
      grouper[letter] = { known: [], unknown: [] };
    }
    return grouper;
  };

  const grouperLocationAndOrderCases = (
    grouper: LetterGrouperFormat,
    sortOrder: SortOrderKeys,
    remainingLocation: "beginning" | "end",
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrderKeys.asc) {
      //groupWithLetter, length?, ascending. 2 cases.
      if (remainingLocation === "beginning") {
        //groupWithLetter, length?, ascending, beginning
        for (const letter in grouper) {
          result.push(...grouper[letter].unknown);
          result.push(...grouper[letter].known);
        }
      } else {
        //groupWithLetter, length?, ascending, end
        for (const letter in grouper) {
          result.push(...grouper[letter].known);
          result.push(...grouper[letter].unknown);
        }
      }
    } else {
      // groupWithLetter, length?, descending. 2 cases
      if (remainingLocation === "beginning") {
        //groupWithLetter, length, descending, beginning
        for (const letter of Object.keys(grouper).reverse()) {
          result.push(...grouper[letter].unknown.reverse());
          result.push(...grouper[letter].known.reverse());
        }
      } else {
        //groupWithLetter, length?, descending, end
        for (const letter of Object.keys(grouper).reverse()) {
          result.push(...grouper[letter].known.reverse());
          result.push(...grouper[letter].unknown.reverse());
        }
      }
    }
    return result;
  };

  const separateLocationAndOrderCases = (
    hiddenWords: string[],
    revealedWords: string[],
    remainingLocation: "beginning" | "end",
    sortOrder: SortOrderKeys,
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrderKeys.asc) {
      if (remainingLocation === "beginning") {
        result.push(...hiddenWords, ...revealedWords);
      } else {
        result.push(...revealedWords, ...hiddenWords);
      }
    } else {
      if (remainingLocation === "beginning") {
        result.push(...hiddenWords.reverse(), ...revealedWords.reverse());
      } else {
        result.push(...revealedWords.reverse(), ...hiddenWords.reverse());
      }
    }
    return result;
  };

  if (remainingGroupWithFirstLetter && remainingRevealFirstLetter) {
    //revealFirstLetter true, groupWithLetter true
    //Variables are location, length, and sort order
    // 8 cases
    const grouper = letterGrouper();
    for (const answer of remainingWords) {
      grouper[answer[0]].unknown.push(answer);
    }
    if (remainingAndSpoiledOnly) {
      for (const word of spoiledWords) {
        grouper[word[0]].known.push(word);
      }
    } else {
      for (const guess of knownWords) {
        grouper[guess[0]].known.push(guess);
      }
    }

    if (remainingRevealLength) {
      //groupWitherLetter, length. 4 cases: sortOrder x location
      for (const letter in grouper) {
        grouper[letter].unknown.sort((a, b) => {
          return lengthSort(a, b) || random(-1, 1);
        });
      }
      return grouperLocationAndOrderCases(
        grouper,
        sortOrder,
        remainingLocation,
      );
    } else {
      //No length. groupWithLetter, no length. 4 cases: sortOrder x location.
      for (const letter in grouper) {
        shuffle(grouper[letter].unknown);
      }
      return grouperLocationAndOrderCases(
        grouper,
        sortOrder,
        remainingLocation,
      );
    }
  } else {
    //Not grouped by first letter.
    //remainingAndSpoiledOnly false, (revealFirstLetter false or groupWithLetter false)
    //Variables are firstLetter, length, location, order
    //16 cases
    if (!remainingRevealFirstLetter && !remainingRevealLength) {
      return separateLocationAndOrderCases(
        shuffle(remainingWords),
        remainingAndSpoiledOnly ? spoiledWords : knownWords,
        remainingLocation,
        sortOrder,
      );
    } else if (remainingRevealFirstLetter && !remainingRevealLength) {
      return separateLocationAndOrderCases(
        remainingWords.sort((a, b) => {
          return flSort(a, b) || random(-1, 1);
        }),
        remainingAndSpoiledOnly ? spoiledWords : knownWords,
        remainingLocation,
        sortOrder,
      );
    } else if (!remainingRevealFirstLetter && remainingRevealLength) {
      return separateLocationAndOrderCases(
        remainingWords.sort((a, b) => {
          return lengthSort(a, b) || random(-1, 1);
        }),
        remainingAndSpoiledOnly ? spoiledWords : knownWords,
        remainingLocation,
        sortOrder,
      );
    } else {
      return separateLocationAndOrderCases(
        remainingWords.sort((a, b) => {
          return flSort(a, b) || lengthSort(a, b);
        }),
        remainingAndSpoiledOnly ? spoiledWords : knownWords,
        remainingLocation,
        sortOrder,
      );
    }
  }
}
