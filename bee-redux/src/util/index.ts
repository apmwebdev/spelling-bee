/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const formatTimestamp = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  const ms = `${date.getMilliseconds()}`.padStart(3, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
};

const betterLog = (style: string, ...toLog: any[]) => {
  const now = new Date();
  const error = new Error();
  const stack = error.stack?.split("\n");
  //Chrome adds "Error" as the first element in the stack trace, while Firefox doesn't
  if (stack && stack[0] === "Error") stack.shift();
  const callerInfo = stack?.[2].trim() ?? "No stack trace";
  console.log(
    `%c${callerInfo}: ${formatTimestamp(now)}`,
    style,
    "\n",
    ...toLog,
  );
};

export const devLog = (...toLog: any[]) => {
  if (import.meta.env.DEV) {
    const style =
      "display: inline-block; padding: 2px 4px; background-color: #004400; color: hsl(0 0% 100% 0.8)";
    betterLog(style, ...toLog);
  }
};

export const errLog = (...toLog: any[]) => {
  const style =
    "display: inline-block; padding: 2px 4px; background-color: #660000; color: hsl(0 0% 100% 0.8)";
  betterLog(style, ...toLog);
};
