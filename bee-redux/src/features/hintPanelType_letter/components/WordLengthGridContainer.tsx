/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import { WordLengthGrid } from "./wordLengthGrid/WordLengthGrid";
import {
  GridData,
  GridRows,
  LetterHintSubsectionProps,
  LetterPanelLocationKeys,
  TotalColumn,
} from "src/features/hintPanelType_letter/types";
import { createSubstringHintDataCell, GridRow } from "@/features/hintPanels";

export function WordLengthGridContainer({
  answers,
  knownWords,
  numberOfLetters,
  location,
  lettersOffset,
  hideKnown,
  statusTracking,
}: LetterHintSubsectionProps) {
  const answerLengths = useAppSelector(selectAnswerLengths);

  const generateData = (): GridData => {
    const relevantAnswerLengths = answerLengths.filter(
      (num) => num >= numberOfLetters + lettersOffset,
    );
    const createGridRow = () => {
      const gridRow: GridRow = {};
      for (const answerLength of relevantAnswerLengths) {
        gridRow[answerLength] = createSubstringHintDataCell();
      }
      return gridRow;
    };

    const gridRows: GridRows = {};
    const totalColumn: TotalColumn = {};
    const totalRow = createGridRow();
    const grandTotal = createSubstringHintDataCell();
    const gridData: GridData = {
      gridRows,
      totalRow,
      totalColumn,
      grandTotal,
      relevantAnswerLengths,
      excludedAnswers: 0,
    };

    for (const answer of answers) {
      if (numberOfLetters + lettersOffset > answer.length) {
        continue;
      }
      let substring: string;
      if (location === LetterPanelLocationKeys.Start) {
        substring = answer.slice(
          lettersOffset,
          lettersOffset + numberOfLetters,
        );
      } else if (lettersOffset > 0) {
        substring = answer.slice(
          -numberOfLetters - lettersOffset,
          -lettersOffset,
        );
      } else {
        substring = answer.slice(-numberOfLetters);
      }
      if (gridRows[substring] === undefined) {
        gridRows[substring] = createGridRow();
      }
      /* The total column substring *should* always be undefined when the grid
         row for that substring is, but just in case, and to future-proof the
         logic, I'm putting it in its own if statement. */
      if (totalColumn[substring] === undefined) {
        totalColumn[substring] = createSubstringHintDataCell();
      }
      gridRows[substring][answer.length].answers++;
      totalColumn[substring].answers++;
      totalRow[answer.length].answers++;
      if (knownWords.includes(answer)) {
        gridRows[substring][answer.length].guesses++;
        totalColumn[substring].guesses++;
        totalRow[answer.length].guesses++;
      }
    }
    if (hideKnown) {
      const newTotalColumn: TotalColumn = {};
      const newTotalRow: GridRow = createGridRow();
      for (const key in totalColumn) {
        if (totalColumn[key].guesses === totalColumn[key].answers) {
          delete gridRows[key];
          delete totalColumn[key];
        }
      }
      for (const key in totalRow) {
        if (totalRow[key].guesses === totalRow[key].answers) {
          delete totalRow[key];
          delete newTotalRow[key];
          Object.values(gridRows).forEach((row) => {
            delete row[key];
          });
        }
      }
      for (const substring in gridRows) {
        const row = gridRows[substring];
        newTotalColumn[substring] = createSubstringHintDataCell();
        for (const answerLength in row) {
          const cell = row[answerLength];
          newTotalColumn[substring].answers += cell.answers;
          newTotalColumn[substring].guesses += cell.guesses;
          newTotalRow[answerLength].answers += cell.answers;
          newTotalRow[answerLength].guesses += cell.guesses;
        }
      }
      gridData.totalColumn = newTotalColumn;
      gridData.totalRow = newTotalRow;
      gridData.relevantAnswerLengths = Object.keys(gridData.totalRow).map(
        (key) => Number(key),
      );
    }
    gridData.grandTotal.answers = Object.values(gridData.totalRow).reduce(
      (sum, cell) => sum + cell.answers,
      0,
    );
    gridData.grandTotal.guesses = Object.values(gridData.totalRow).reduce(
      (sum, cell) => sum + cell.guesses,
      0,
    );
    gridData.excludedAnswers = answers.length - gridData.grandTotal.answers;
    return gridData;
  };

  return (
    <div className="LetterPanel_WLG_Container">
      <WordLengthGridKey statusTracking={statusTracking} />
      <WordLengthGrid
        {...generateData()}
        statusTracking={statusTracking}
        hideKnown={hideKnown}
      />
      <div>Excluded words: {generateData().excludedAnswers}</div>
    </div>
  );
}
