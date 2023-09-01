import { LetterHintSubsectionProps } from "@/features/hints/components/panels/letter/types";
import {
  LetterPanelLocationKeys,
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hints";
import {
  ListData,
  ListRows,
} from "@/features/hints/components/panels/letter/WordCountList";

export const getTdClasses = (
  cell: SubstringHintDataCell,
  isTotalRow: boolean = false,
  isTotalColumn: boolean = false,
  statusTracking: StatusTrackingKeys,
): string => {
  if (cell.answers === 0 && !isTotalRow && !isTotalColumn) {
    return "sb-wlg-content";
  }
  let returnStr = "";
  if (statusTracking !== "total") {
    if (cell.guesses === cell.answers) {
      returnStr += "hint-completed";
    } else if (cell.guesses === 0) {
      returnStr += "hint-not-started";
    } else {
      returnStr += "hint-in-progress";
    }
  }
  if (!isTotalRow && !isTotalColumn) {
    return returnStr + " sb-wlg-content sb-wlg-content-full";
  }
  if (isTotalRow) {
    returnStr += " sb-wlg-total-row";
  }
  if (isTotalColumn) {
    returnStr += " sb-wlg-total-column";
  }
  return returnStr;
};

export const generateListData = ({
  answers,
  knownWords,
  numberOfLetters,
  location,
  showKnown,
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
  if (!showKnown) {
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
