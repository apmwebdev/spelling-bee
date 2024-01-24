/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSelector } from "@reduxjs/toolkit";
import {
  selectGuesses,
  selectGuessWords,
} from "@/features/guesses/api/guessesSlice";
import { selectAnswers } from "@/features/puzzle/api/puzzleSlice";
import { calculateScore } from "@/util";
import {
  AnswersByLetter,
  AnswersByLetterSortable,
  createLetterAnswers,
} from "@/features/progress/types/progressTypes";

export const selectKnownAnswers = createSelector(
  [selectAnswers, selectGuessWords],
  (answers, guessWords) =>
    answers.filter((answer) => guessWords.includes(answer.word)),
);

export const selectKnownAnswerWords = createSelector(
  [selectKnownAnswers],
  (answers) => answers.map((answer) => answer.word),
);

export const selectRemainingAnswers = createSelector(
  [selectAnswers, selectKnownAnswerWords],
  (answers, knownWords) =>
    answers.filter((answer) => !knownWords.includes(answer.word)),
);

export const selectRemainingAnswerWords = createSelector(
  [selectRemainingAnswers],
  (answers) => {
    return answers.map((answer) => answer.word);
  },
);

export const selectCorrectGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => guess.isAnswer && !guess.isSpoiled),
);

export const selectCorrectGuessWords = createSelector(
  [selectCorrectGuesses],
  (guesses) =>
    guesses
      .filter((guess) => guess.isAnswer && !guess.isSpoiled)
      .map((guess) => guess.text),
);

export const selectKnownAnswerGuesses = createSelector(
  [selectGuesses],
  (guesses) => guesses.filter((guess) => guess.isAnswer),
);

export const selectWrongGuesses = createSelector([selectGuesses], (guesses) =>
  guesses.filter((guess) => !guess.isAnswer),
);

export const selectScore = createSelector(
  [selectCorrectGuessWords],
  (correctGuessWords) => calculateScore(correctGuessWords),
);

export const selectAnswersByLetter = createSelector(
  [selectAnswers, selectKnownAnswerWords],
  (answers, knownWords) => {
    const asc: AnswersByLetter = {};
    const desc: AnswersByLetter = {};
    const answersByLetterSortable: AnswersByLetterSortable = { asc, desc };
    for (const answer of answers) {
      const firstLetter = answer.word[0];
      if (asc[firstLetter] === undefined) {
        asc[firstLetter] = createLetterAnswers();
        desc[firstLetter] = createLetterAnswers();
      }
      asc[firstLetter].all.push(answer);
      desc[firstLetter].all.unshift(answer);
      if (knownWords.includes(answer.word)) {
        asc[firstLetter].known.push(answer);
        desc[firstLetter].known.unshift(answer);
      } else {
        asc[firstLetter].unknown.push(answer);
        desc[firstLetter].unknown.unshift(answer);
      }
    }
    for (const letter in asc) {
      asc[letter].unknown.sort((a, b) => a.word.length - b.word.length);
      desc[letter].unknown.sort((a, b) => b.word.length - a.word.length);
    }
    return answersByLetterSortable;
  },
);
