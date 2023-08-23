import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "../LetterHintPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";
import uniqid from "uniqid";
import { WordLengthGridKey } from "./WordLengthGridKey";
import { LetterPanelLocations, StatusTrackingOptions } from "@/features/hints";

export interface GridRow {
  [index: number]: LetterHintDataCell;
}

export interface GridRows {
  [substring: string]: GridRow;
}

interface GridData {
  excludedAnswers: number;
  gridRows: GridRows;
  totalRow: GridRow;
}

export function WordLengthGrid({
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

  const generateOutput = () => {
    const { excludedAnswers, gridRows, totalRow } = generateData();
    const numberOfRows = Object.keys(gridRows).length + 3;
    const numberOfColumns = Object.keys(Object.values(gridRows)[0]).length + 2;
    const gridStyle = {
      gridTemplateRows: `max-content repeat(${numberOfRows - 1}, 1fr)`,
      gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
    };
    const gridArr = [];

    const createCell = (displayString: string, stylingClasses?: string) => {
      gridArr.push(
        <div key={uniqid()} className={stylingClasses}>
          {displayString}
        </div>,
      );
    };

    const populateGridCellContent = (
      cell: LetterHintDataCell,
      isTotalRow: boolean = false,
      isTotalColumn: boolean = false,
    ) => {
      const found = cell.guesses;
      const total = cell.answers;
      const remaining = total - found;

      const getCellClasses = (
        cell: LetterHintDataCell,
        isTotalRow: boolean = false,
        isTotalColumn: boolean = false,
      ): string => {
        if (cell.answers === 0 && !isTotalRow && !isTotalColumn) {
          return "sb-wlg-content";
        }
        let returnStr = "";
        if (statusTracking !== StatusTrackingOptions.Total) {
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
      //So TypeScript will stop complaining when using spread syntax below
      const args: [LetterHintDataCell, boolean, boolean] = [
        cell,
        isTotalRow,
        isTotalColumn,
      ];

      if (total === 0) {
        createCell("", getCellClasses(...args));
        return;
      }
      switch (statusTracking) {
        case StatusTrackingOptions.FoundOfTotal:
          createCell(`${found}/${total}`, getCellClasses(...args));
          break;
        case StatusTrackingOptions.RemainingOfTotal:
          createCell(`${remaining}/${total}`, getCellClasses(...args));
          break;
        case StatusTrackingOptions.Found:
          createCell(`${found}`, getCellClasses(...args));
          break;
        case StatusTrackingOptions.Remaining:
          createCell(`${remaining}`, getCellClasses(...args));
          break;
        case StatusTrackingOptions.Total:
          createCell(`${total}`, getCellClasses(...args));
      }
    };

    //super header labeling y axis (letters)
    createCell("Letters", "sb-word-length-grid-y-label axis-label");

    //super header labeling x axis (word length)
    gridArr.push(
      <div
        className="sb-word-length-grid-x-label axis-label"
        style={{ gridColumn: `2 / ${numberOfColumns + 1}` }}
        key={uniqid()}
      >
        Word Length →
      </div>,
    );
    //header with down arrow for labeling y axis
    createCell("↓", "");

    //headers for word length columns
    for (const num of answerLengths) {
      createCell(`${num}`, "sb-wlg-col-header");
    }

    //header for Total column
    createCell("Total", "sb-wlg-col-header");

    //rows of table, including row headers
    for (const property in gridRows) {
      //row header
      createCell(`${property}`, "sb-wlg-row-header");
      //row content
      for (const cell in gridRows[property]) {
        populateGridCellContent(gridRows[property][cell]);
      }
      const rowAnswerTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.answers,
        0,
      );
      const rowGuessTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.guesses,
        0,
      );
      //row total
      populateGridCellContent(
        {
          answers: rowAnswerTotal,
          guesses: rowGuessTotal,
        },
        false,
        true,
      );
    }
    //Total Row row header
    createCell("Total", "sb-wlg-row-header sb-wlg-total");
    //column totals
    for (const cell in totalRow) {
      populateGridCellContent(totalRow[cell], true);
    }
    const answerGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.answers,
      0,
    );
    const guessGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.guesses,
      0,
    );
    //grand total cell
    populateGridCellContent(
      {
        answers: answerGrandTotal,
        guesses: guessGrandTotal,
      },
      true,
      true,
    );
    return (
      <div className="sb-word-length-grid-container">
        <WordLengthGridKey statusTracking={statusTracking} />
        <div className="sb-word-length-grid" style={gridStyle}>
          {gridArr}
        </div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };
  return generateOutput();
}
