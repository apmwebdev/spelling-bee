export const calculateScore = (words: string[]) => {
  return words.reduce((score, word) => {
    if (word.length === 4) {
      return score + 1;
    }
    let wordScore = word.length;
    let uniqueLetters = "";
    for (const letter of word) {
      if (!uniqueLetters.includes(letter)) {
        uniqueLetters += letter;
      }
    }
    if (uniqueLetters.length === 7) {
      wordScore += 7;
    }
    return score + wordScore;
  }, 0);
};

export const calculateWordScore = (word: string) => {
  return calculateScore([word]);
};

export const dateRegex = /^20[1-2]\d_?[0-1]\d_?[0-3]\d$/;

export const getDateFromString = (dateString: string) => {
  let refinedDateString = dateString.replaceAll("_", "");
  refinedDateString = refinedDateString.replaceAll("-", "");
  const date = new Date();
  const yearValue = Number(refinedDateString.slice(0, 4));
  const monthValue = Number(refinedDateString.slice(4, 6));
  const dayValue = Number(refinedDateString.slice(6, 8));
  date.setFullYear(yearValue, monthValue - 1, dayValue);
  return date;
};

export const getDateString = (date: Date) => {
  let formatted_date = date.toISOString().split("T")[0];
  formatted_date.replaceAll("-", "");
  return formatted_date;
};

const getAdjacentDateString = (
  dateString: string,
  relation: "previous" | "next",
) => {
  const puzzleDate = getDateFromString(dateString);
  const adjacentPuzzleDate = new Date(puzzleDate);
  if (relation === "previous") {
    adjacentPuzzleDate.setDate(adjacentPuzzleDate.getDate() - 1);
  } else {
    adjacentPuzzleDate.setDate(adjacentPuzzleDate.getDate() + 1);
  }
  return getDateString(adjacentPuzzleDate);
};

export const getPreviousPuzzleDateString = (dateString: string) => {
  if (!dateString.match(dateRegex)) {
    return "";
  }
  return getAdjacentDateString(dateString, "previous");
};

export const getNextPuzzleDateString = (dateString: string) => {
  if (!dateString.match(dateRegex)) {
    return "";
  }
  return getAdjacentDateString(dateString, "next");
};

/**
 * Creates a CSS class list string to be used as the className prop on a
 * component
 * @param {Array<string | undefined>} classes - Takes any number of strings to be
 *   concatenated together for the final class list. Can also take undefined
 *   values so that classes can be added conditionally.
 * @returns {string | undefined}
 */
export const composeClasses = (
  ...classes: Array<string | undefined>
): string | undefined => {
  const [baseClasses, ...additionalClasses] = classes;

  /* The first string is the base class(es). If it's blank or undefined, return
   * early. Additional classes are optional. */
  if (!baseClasses) return undefined;

  let finalClasses = baseClasses;
  for (const additionalClass of additionalClasses) {
    if (typeof additionalClass === "string" && additionalClass.length > 0) {
      finalClasses += ` ${additionalClass}`;
    }
  }
  return finalClasses;
};

export const maybeAddDisabledClass = (
  baseClasses: string,
  disabled?: boolean,
) => {
  return composeClasses(baseClasses, disabled ? "disabled" : "");
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
