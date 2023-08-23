import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "../LetterHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import { LetterPanelLocations } from "@/features/hints";
import { WordLengthGrid } from "@/features/hints/components/panels/letter/wordLengthGrid/WordLengthGrid";

export interface GridRow {
  [index: number]: LetterHintDataCell;
}

export interface GridRows {
  [substring: string]: GridRow;
}

export interface GridData {
  gridRows: GridRows;
  totalRow: GridRow;
  excludedAnswers: number;
}

export function WordLengthGridContainer({
  answers,
  correctGuessWords,
  numberOfLetters,
  location,
  lettersOffset,
  statusTracking,
}: LetterHintSubsectionProps) {
  const answerLengths = useAppSelector(selectAnswerLengths);

  const generateData = (): GridData => {
    const generateRowObject = () => {
      const returnObj: GridRow = {};
      for (const answerLength of answerLengths) {
        returnObj[answerLength] = { answers: 0, guesses: 0 };
      }
      return returnObj;
    };

    const gridRows: GridRows = {};
    const totalRow = generateRowObject();
    let excludedAnswers = 0;

    for (const answer of answers) {
      if (lettersOffset + numberOfLetters > answer.length) {
        excludedAnswers++;
        continue;
      }
      let substring: string;
      if (location === LetterPanelLocations.Start) {
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
        gridRows[substring] = generateRowObject();
      }
      gridRows[substring][answer.length].answers++;
      totalRow[answer.length].answers++;
      if (correctGuessWords.includes(answer)) {
        gridRows[substring][answer.length].guesses++;
        totalRow[answer.length].guesses++;
      }
    }
    return { excludedAnswers, gridRows, totalRow };
  };

  return (
    <div className="sb-word-length-grid-container">
      <WordLengthGridKey statusTracking={statusTracking} />
      <WordLengthGrid
        {...generateData()}
        answerLengths={answerLengths}
        statusTracking={statusTracking}
      />
      <div>Excluded words: {generateData().excludedAnswers}</div>
    </div>
  );
}
