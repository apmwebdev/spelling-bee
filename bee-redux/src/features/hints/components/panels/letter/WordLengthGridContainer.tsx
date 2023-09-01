import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import {
  createSubstringHintDataCell,
  GridRow,
  LetterPanelLocationKeys,
} from "@/features/hints";
import { WordLengthGrid } from "@/features/hints/components/panels/letter/wordLengthGrid/WordLengthGrid";
import {
  GridData,
  GridRows,
  LetterHintSubsectionProps,
  TotalColumn,
} from "@/features/hints/components/panels/letter/types";

export function WordLengthGridContainer({
  answers,
  knownWords,
  numberOfLetters,
  location,
  lettersOffset,
  showKnown,
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
    if (!showKnown) {
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
    <div className="sb-word-length-grid-container">
      <WordLengthGridKey statusTracking={statusTracking} />
      <WordLengthGrid
        {...generateData()}
        statusTracking={statusTracking}
        showKnown={showKnown}
      />
      <div>Excluded words: {generateData().excludedAnswers}</div>
    </div>
  );
}
