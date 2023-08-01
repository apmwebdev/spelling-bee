import { SortOrder } from "../wordListSettingsSlice";
import { random, shuffle } from "lodash";

/**
 * Cases
 * Remaining only: 7 cases
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
interface LetterGrouperCell {
  found: string[];
  remaining: string[];
}

interface LetterGrouperFormat {
  [letter: string]: LetterGrouperCell;
}

//Function assumes all arrays are already sorted using default sort
interface answerSorterParams {
  remainingWords: string[];
  revealedWords: string[];
  validLetters: string[];
  sortOrder: SortOrder;
  remainingOnly: boolean;
  remainingRevealFirstLetter: boolean;
  remainingRevealLength: boolean;
  remainingLocation: "beginning" | "end";
  remainingGroupWithLetter: boolean;
}

export default function answerSorter({
  remainingWords,
  revealedWords,
  validLetters,
  sortOrder,
  remainingOnly,
  remainingRevealFirstLetter,
  remainingRevealLength,
  remainingLocation,
  remainingGroupWithLetter,
}: answerSorterParams) {
  const order = (sortResult: number) => {
    if (sortResult === 0) {
      return sortResult;
    }
    return sortOrder === SortOrder.Ascending ? sortResult : -sortResult;
  };

  const flSort = (a: string, b: string) => {
    return a[0].localeCompare(b[0]);
  };

  const lengthSort = (a: string, b: string) => {
    return a.length - b.length;
  };

  const letterGrouper = (): LetterGrouperFormat => {
    const grouper: LetterGrouperFormat = {};
    for (const letter of validLetters) {
      grouper[letter] = { found: [], remaining: [] };
    }
    return grouper;
  };

  const grouperLocationAndOrderCases = (
    grouper: LetterGrouperFormat,
    sortOrder: SortOrder,
    remainingLocation: "beginning" | "end",
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrder.Ascending) {
      //groupWithLetter, length?, ascending. 2 cases.
      if (remainingLocation === "beginning") {
        //groupWithLetter, length?, ascending, beginning
        for (const letter in grouper) {
          result.push(...grouper[letter].remaining);
          result.push(...grouper[letter].found);
        }
      } else {
        //groupWithLetter, length?, ascending, end
        for (const letter in grouper) {
          result.push(...grouper[letter].found);
          result.push(...grouper[letter].remaining);
        }
      }
    } else {
      // groupWithLetter, length?, descending. 2 cases
      if (remainingLocation === "beginning") {
        //groupWithLetter, length, descending, beginning
        for (const letter of Object.keys(grouper).reverse()) {
          result.push(...grouper[letter].remaining.reverse());
          result.push(...grouper[letter].found.reverse());
        }
      } else {
        //groupWithLetter, length?, descending, end
        for (const letter of Object.keys(grouper).reverse()) {
          result.push(...grouper[letter].found.reverse());
          result.push(...grouper[letter].remaining.reverse());
        }
      }
    }
    return result;
  };

  const separateLocationAndOrderCases = (
    remainingWords: string[],
    correctGuessWords: string[],
    remainingLocation: "beginning" | "end",
    sortOrder: SortOrder,
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrder.Ascending) {
      if (remainingLocation === "beginning") {
        result.push(...remainingWords, ...correctGuessWords);
      } else {
        result.push(...correctGuessWords, ...remainingWords);
      }
    } else {
      if (remainingLocation === "beginning") {
        result.push(
          ...remainingWords.reverse(),
          ...correctGuessWords.reverse(),
        );
      } else {
        result.push(
          ...correctGuessWords.reverse(),
          ...remainingWords.reverse(),
        );
      }
    }
    return result;
  };

  if (remainingOnly) {
    const remainingCopy = [...remainingWords];
    if (remainingRevealFirstLetter && remainingRevealLength) {
      // Remaining only, first letter, length
      // Primary sort: first letter, secondary sort: length
      return remainingCopy.sort((a, b) => {
        return order(flSort(a, b) || lengthSort(a, b));
      });
    } else if (remainingRevealFirstLetter && !remainingRevealLength) {
      // Remaining only, first letter, NO length
      // Primary sort: first letter, secondary sort: random
      return remainingCopy.sort((a, b) => {
        return order(flSort(a, b) || random(-1, 1));
      });
    } else if (!remainingRevealFirstLetter && remainingRevealLength) {
      // Remaining only, length, no first letter
      // Primary sort: length, secondary: random
      return remainingCopy.sort((a, b) => {
        return order(lengthSort(a, b) || random(-1, 1));
      });
    } else {
      // Remaining only, no first letter, no length
      // Random sort
      return shuffle(remainingCopy);
    }
  } else {
    // remainingOnly = false. Sort remaining answers with found answers
    if (remainingGroupWithLetter && remainingRevealFirstLetter) {
      //remainingOnly false, revealFirstLetter true, groupWithLetter true
      //Only variables are location, length, and sort order
      // 8 cases
      const grouper = letterGrouper();
      for (const answer of remainingWords) {
        grouper[answer[0]].remaining.push(answer);
      }
      for (const guess of revealedWords) {
        grouper[guess[0]].found.push(guess);
      }

      if (remainingRevealLength) {
        //groupWitherLetter, length. 4 cases: sortOrder x location
        for (const letter in grouper) {
          grouper[letter].remaining.sort((a, b) => {
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
          shuffle(grouper[letter].remaining);
        }
        return grouperLocationAndOrderCases(
          grouper,
          sortOrder,
          remainingLocation,
        );
      }
    } else {
      //Not grouped by first letter.
      //remainingOnly false, (revealFirstLetter false or groupWithLetter false)
      //Variables are firstLetter, length, location, order
      //16 cases
      if (!remainingRevealFirstLetter && !remainingRevealLength) {
        return separateLocationAndOrderCases(
          shuffle(remainingWords),
          revealedWords,
          remainingLocation,
          sortOrder,
        );
      } else if (remainingRevealFirstLetter && !remainingRevealLength) {
        return separateLocationAndOrderCases(
          remainingWords.sort((a, b) => {
            return flSort(a, b) || random(-1, 1);
          }),
          revealedWords,
          remainingLocation,
          sortOrder,
        );
      } else if (!remainingRevealFirstLetter && remainingRevealLength) {
        return separateLocationAndOrderCases(
          remainingWords.sort((a, b) => {
            return lengthSort(a, b) || random(-1, 1);
          }),
          revealedWords,
          remainingLocation,
          sortOrder,
        );
      } else {
        return separateLocationAndOrderCases(
          remainingWords.sort((a, b) => {
            return flSort(a, b) || lengthSort(a, b);
          }),
          revealedWords,
          remainingLocation,
          sortOrder,
        );
      }
    }
  }
}
