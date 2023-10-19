import uniqid from "uniqid";
import {
  generateListData,
  LetterHintSubsectionProps,
} from "@/features/hintPanelType_letter";
import {
  getSubstringHintStatusClasses,
  SubstringHintDataCell,
} from "@/features/hintPanels";

export function LettersPresent({
  answers,
  knownWords,
  numberOfLetters,
  location,
  lettersOffset,
  statusTracking,
  hideKnown,
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
      hideKnown,
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
        <div className="LetterPanel_LettersPresentList">
          {startingLetterDivs}
        </div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return content();
}