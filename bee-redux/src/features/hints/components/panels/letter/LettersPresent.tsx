import uniqid from "uniqid";
import { LetterHintSubsectionProps } from "@/features/hints/components/panels/letter/types";
import { generateListData } from "@/features/hints/components/panels/letter/util";
import { SubstringHintDataCell } from "@/features/hints";

export function LettersPresent({
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
      const cellClasses = () => {
        let classList = "sb-lol-fragment";
        if (statusTracking === "total") {
          return classList;
        }
        if (cell.guesses === cell.answers) {
          classList += " hint-completed";
        } else if (cell.guesses === 0) {
          classList += " hint-not-started";
        } else {
          classList += " hint-in-progress";
        }
        return classList;
      };

      fragmentDivs.push(
        <div key={uniqid()} className={cellClasses()}>
          {fragment}
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
        <div key={uniqid()} className="LetterPanel_LPL_Row">
          {fragmentDivs}
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

  return generateOutput();
}
