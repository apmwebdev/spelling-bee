import uniqid from "uniqid";
import { LetterHintSubsectionProps } from "@/features/hints/components/letterPanel/types";
import { generateListData } from "@/features/hints/components/letterPanel/util";
import {
  getSubstringHintStatusClasses,
  SubstringHintDataCell,
} from "@/features/hints";

export function LettersPresent({
  answers,
  knownWords,
  numberOfLetters,
  location,
  lettersOffset,
  statusTracking,
  showKnown,
}: LetterHintSubsectionProps) {
  const content = () => {
    const createCell = ({
      cell,
      letters,
      letterDivs,
    }: {
      cell: SubstringHintDataCell;
      letters: string;
      letterDivs: any[];
    }) => {
      letterDivs.push(
        <div
          key={uniqid()}
          className={getSubstringHintStatusClasses({
            baseClasses: "LetterPanel_LPL_Cell",
            cell,
            statusTracking,
          })}
        >
          {letters}
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
        <div key={uniqid()} className="LetterPanel_LPL_Row">
          {letterDivs}
        </div>,
      );
    }

    return (
      <div className="LetterPanel_LPL_Container">
        {/*<WordLengthGridKey tracking={tracking} />*/}
        <div className="LetterPanel_LettersPresentList">
          {startingLetterDivs}
        </div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return content();
}
