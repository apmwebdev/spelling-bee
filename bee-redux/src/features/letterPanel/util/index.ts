/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  LetterHintSubsectionProps,
  LetterPanelLocationKeys,
} from "@/features/letterPanel";
import { ListData, ListRows } from "../components/WordCountList";
import {
  StatusTrackingKeys,
  SubstringHintDataCell,
  SubstringHintOutputKeys,
} from "@/features/hintPanels";

export const getTdClasses = (
  cell: SubstringHintDataCell,
  isTotalRow: boolean = false,
  isTotalColumn: boolean = false,
  statusTracking: StatusTrackingKeys,
): string => {
  if (cell.answers === 0 && !isTotalRow && !isTotalColumn) {
    return "LetterPanel_WLG_Content";
  }
  let returnStr = "";
  if (statusTracking !== "total") {
    if (cell.guesses === cell.answers) {
      returnStr += "SuccessText";
    } else if (cell.guesses === 0) {
      returnStr += "ErrorText";
    } else {
      returnStr += "WarningText";
    }
  }
  if (!isTotalRow && !isTotalColumn) {
    return returnStr + " LetterPanel_WLG_Content LetterPanel_WLG_ContentFull";
  }
  if (isTotalRow) {
    returnStr += " LetterPanel_WLG_TotalRow";
  }
  if (isTotalColumn) {
    returnStr += " LetterPanel_WLG_TotalColumn";
  }
  return returnStr;
};

export const generateListData = ({
  answers,
  knownWords,
  numberOfLetters,
  location,
  hideKnown,
  lettersOffset,
}: LetterHintSubsectionProps): ListData => {
  const listRows: ListRows = {};
  let excludedAnswers = 0;

  for (const answer of answers) {
    if (lettersOffset + numberOfLetters > answer.length) {
      excludedAnswers++;
      continue;
    }
    let answerFragment: string;
    if (location === LetterPanelLocationKeys.Start) {
      answerFragment = answer.slice(
        lettersOffset,
        lettersOffset + numberOfLetters,
      );
    } else if (lettersOffset > 0) {
      answerFragment = answer.slice(
        -numberOfLetters - lettersOffset,
        -lettersOffset,
      );
    } else {
      answerFragment = answer.slice(-numberOfLetters);
    }
    const startingLetter = answerFragment.charAt(0);
    if (listRows[startingLetter] === undefined) {
      listRows[startingLetter] = {};
    }
    if (listRows[startingLetter][answerFragment] === undefined) {
      listRows[startingLetter][answerFragment] = { answers: 0, guesses: 0 };
    }
    listRows[startingLetter][answerFragment].answers++;
    if (knownWords.includes(answer)) {
      listRows[startingLetter][answerFragment].guesses++;
    }
  }
  if (hideKnown) {
    for (const letter in listRows) {
      const row = listRows[letter];
      for (const fragment in row) {
        if (row[fragment].guesses === row[fragment].answers) {
          delete row[fragment];
        }
      }
      if (Object.values(row).length === 0) {
        // delete row if empty
        delete listRows[letter];
      }
    }
  }
  return { excludedAnswers, listRows };
};

/** For use in HintPanelContentMain. That component needs to make it so some parts of a hint panel
 * are horizontally scrollable to make sure that the hint panel doesn't become wider than the
 * viewport and mess up the UI on small mobile screens. But not all parts of a hint panel's content
 * need to be scrollable, so it needs to be able to put some content in a nonscrollable div that
 * will always remain centered, and potentially wide content in a scrollable div.
 *
 * For letter panels, the grid or list should be scrollable, but the key should not be. The key
 * should always be small enough to fit into the hint panel, no matter the screen size.
 *
 * However, not all letter panel types need a key. The Word Length Grid and Word Count List do, but
 * Letters Only does not.
 *
 * Therefore, HintPanelContentMain should add a key to the nonscrollable content, but only if that
 * letter panel's output type requires a key. This function determines that.
 * @param outputType
 */
export const letterPanelNeedsKey = (outputType: SubstringHintOutputKeys) => {
  return (
    outputType === SubstringHintOutputKeys.WordLengthGrid ||
    outputType === SubstringHintOutputKeys.WordCountList
  );
};
