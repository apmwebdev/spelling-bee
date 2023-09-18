import { SortOrder } from "../../api/wordListSettingsSlice";
import { random, shuffle } from "lodash";

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
interface LetterGrouperCell {
  known: string[];
  unknown: string[];
}

interface LetterGrouperFormat {
  [letter: string]: LetterGrouperCell;
}

//Function assumes all arrays are already sorted using default sort
interface answerSorterParams {
  remainingWords: string[];
  knownWords: string[];
  spoiledWords: string[];
  validLetters: string[];
  sortOrder: SortOrder;
  remainingAndSpoiledOnly: boolean;
  remainingRevealFirstLetter: boolean;
  remainingRevealLength: boolean;
  remainingLocation: "beginning" | "end";
  remainingGroupWithLetter: boolean;
}

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
  remainingGroupWithLetter,
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
    sortOrder: SortOrder,
    remainingLocation: "beginning" | "end",
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrder.Ascending) {
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
    sortOrder: SortOrder,
  ) => {
    const result: string[] = [];
    if (sortOrder === SortOrder.Ascending) {
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

  if (remainingGroupWithLetter && remainingRevealFirstLetter) {
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
