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

export const composeClasses = (
  baseClasses: string,
  ...additionalClasses: string[]
) => {
  let finalClasses = baseClasses;
  for (const additionalClass of additionalClasses) {
    if (additionalClass.length > 0) {
      finalClasses += ` ${additionalClass}`;
    }
  }
  return finalClasses;
};

export const maybeDisable = (baseClasses: string, disabled?: boolean) => {
  return composeClasses(baseClasses, disabled ? "disabled" : "");
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
