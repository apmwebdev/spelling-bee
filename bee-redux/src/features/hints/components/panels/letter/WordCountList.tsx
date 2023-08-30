import uniqid from "uniqid";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import { StatusTrackingOptions } from "@/features/hints";
import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "@/features/hints/components/panels/letter/types";
import { generateListData } from "@/features/hints/components/panels/letter/util";

export interface ListRow {
  [substring: string]: LetterHintDataCell;
}

export interface ListRows {
  [startingLetter: string]: ListRow;
}

export interface ListData {
  excludedAnswers: number;
  listRows: ListRows;
}

export function WordCountList({
  answers,
  correctGuessWords,
  numberOfLetters,
  location,
  lettersOffset,
  statusTracking,
  showKnown,
}: LetterHintSubsectionProps) {
  const generateOutput = () => {
    const createCell = ({
      cell,
      fragment,
      fragmentDivs,
    }: {
      cell: LetterHintDataCell;
      fragment: string;
      fragmentDivs: any[];
    }) => {
      const found = cell.guesses;
      const total = cell.answers;
      const remaining = total - found;

      const cellClasses = () => {
        let classList = "sb-wcl-fragment-count";
        if (statusTracking === "total") {
          return classList;
        }
        if (found === total) {
          classList += " hint-completed";
        } else if (found === 0) {
          classList += " hint-not-started";
        } else {
          classList += " hint-in-progress";
        }
        return classList;
      };

      fragmentDivs.push(
        <div key={uniqid()} className="sb-wcl-fragment-cell">
          <div className="sb-wcl-fragment-label">{fragment}</div>
          <div className={cellClasses()}>
            {StatusTrackingOptions[statusTracking].outputFn({
              found,
              total,
              remaining,
            })}
          </div>
        </div>,
      );
    };

    const { excludedAnswers, listRows } = generateListData({
      answers,
      correctGuessWords,
      numberOfLetters,
      location,
      lettersOffset,
      statusTracking,
      showKnown,
    });
    const startingLetterDivs = [];

    for (const startingLetter in listRows) {
      const listRow = listRows[startingLetter];
      const fragmentDivs: any[] = [];

      for (const fragment in listRow) {
        const dataCell = listRow[fragment];
        createCell({ cell: dataCell, fragment, fragmentDivs });
      }

      startingLetterDivs.push(
        <div key={uniqid()} className="sb-wcl-row">
          {fragmentDivs}
        </div>,
      );
    }

    return (
      <div className="sb-word-count-list-container">
        <WordLengthGridKey statusTracking={statusTracking} />
        <div className="sb-word-count-list">{startingLetterDivs}</div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return generateOutput();
}
