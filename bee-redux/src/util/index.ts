import classNames from "classnames/dedupe";

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
 * Concatenate a single CSS class list string from any number of individual
 * input strings to be used as the className prop on a React component.
 * @param {Array<string | undefined>} classes - Takes any number of strings to be
 *   concatenated together for the final class list. Can also take undefined
 *   values so that classes can be added conditionally.
 * @returns {string | undefined}
 * @deprecated - Use the `classNames` package instead. It does the same thing as
 *   this function, plus a lot more. I'm leaving this code for one commit to
 *   have a record of the optimizations that I've realized *could* be made to
 *   it if I weren't removing it altogether.
 */
export const composeClasses = (
  ...classes: Array<string | undefined>
): string | null => {
  let finalClasses = "";
  //A for loop is the fastest method of iterating through the array
  for (let i = 0; i < classes.length; i++) {
    /* In the classes[i].length check, TS complains about classes[i] possibly
     * being undefined even though we check for that right before.
     * @ts-ignore. */
    if (typeof classes[i] === "string" && classes[i].length > 0) {
      finalClasses += finalClasses ? classes[i] : ` ${classes[i]}`;
    }
  }
  /* If finalClasses is blank, return null, because otherwise React will
   * render the resulting element with a class attribute set to an empty string
   * instead of leaving it off entirely. */
  return finalClasses || null;
};

export const maybeAddDisabledClass = (
  baseClasses: string,
  disabled?: boolean,
) => {
  return classNames(baseClasses, disabled ? "disabled" : "");
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
