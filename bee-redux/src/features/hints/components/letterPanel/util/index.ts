import { LetterHintSubsectionProps } from "@/features/hints/components/letterPanel/types";
import {
  LetterPanelLocationKeys,
  SubstringHintDataCell,
} from "@/features/hints";
import {
  ListData,
  ListRows,
} from "@/features/hints/components/letterPanel/WordCountList";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

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
      returnStr += "HintCompleted";
    } else if (cell.guesses === 0) {
      returnStr += "HintNotStarted";
    } else {
      returnStr += "HintInProgress";
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
