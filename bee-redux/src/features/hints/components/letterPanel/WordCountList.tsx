import uniqid from "uniqid";
import { WordLengthGridKey } from "./wordLengthGrid/WordLengthGridKey";
import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
  SubstringHintDataCell,
} from "@/features/hints";
import { LetterHintSubsectionProps } from "@/features/hints/components/letterPanel/types";
import { generateListData } from "@/features/hints/components/letterPanel/util";

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
      letters,
      letterDivs,
    }: {
      cell: SubstringHintDataCell;
      letters: string;
      letterDivs: any[];
    }) => {
      const cellClasses = getSubstringHintStatusClasses({
        baseClasses: "LetterPanel_WCL_CellCount",
        cell,
        statusTracking,
      });

      letterDivs.push(
        <div key={uniqid()} className="LetterPanel_WCL_Cell">
          <div>{letters}</div>
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
      const letterDivs: any[] = [];

      for (const letters in listRow) {
        const dataCell = listRow[letters];
        createCell({ cell: dataCell, letters, letterDivs });
      }

      startingLetterDivs.push(
        <div key={uniqid()} className="LetterPanel_WCL_Row">
          {letterDivs}
        </div>,
      );
    }

    return (
      <div className="LetterPanel_WCL_Container">
        <WordLengthGridKey statusTracking={statusTracking} />
        <div className="LetterPanel_WordCountList">{startingLetterDivs}</div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return generateOutput();
}
