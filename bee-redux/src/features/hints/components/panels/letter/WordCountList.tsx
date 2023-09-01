import uniqid from "uniqid";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
  SubstringHintDataCell,
} from "@/features/hints";
import { LetterHintSubsectionProps } from "@/features/hints/components/panels/letter/types";
import { generateListData } from "@/features/hints/components/panels/letter/util";

export interface ListRow {
  [substring: string]: SubstringHintDataCell;
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
  knownWords,
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
      cell: SubstringHintDataCell;
      fragment: string;
      fragmentDivs: any[];
    }) => {
      const cellClasses = getSubstringHintStatusClasses({
        baseClasses: "sb-wcl-fragment-count",
        cell,
        statusTracking,
      });

      fragmentDivs.push(
        <div key={uniqid()} className="sb-wcl-fragment-cell">
          <div className="sb-wcl-fragment-label">{fragment}</div>
          <div className={cellClasses}>
            {StatusTrackingOptions[statusTracking].outputFn(cell)}
          </div>
        </div>,
      );
    };

    const { excludedAnswers, listRows } = generateListData({
      answers,
      knownWords,
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
