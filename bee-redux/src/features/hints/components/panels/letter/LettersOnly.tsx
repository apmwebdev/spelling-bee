import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "../LetterHintPanel";
import uniqid from "uniqid";
import { generateData } from "./WordCountList";
import { StatusTrackingKeys } from "@/features/hints";

export function LettersOnly({
  answers,
  correctGuessWords,
  numberOfLetters,
  location,
  lettersOffset,
  statusTracking,
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

    const { excludedAnswers, listRows } = generateData({
      answers,
      correctGuessWords,
      numberOfLetters,
      location,
      lettersOffset,
      statusTracking,
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
        <div key={uniqid()} className="sb-lol-row">
          {fragmentDivs}
        </div>,
      );
    }

    return (
      <div className="sb-letters-only-list-container">
        {/*<WordLengthGridKey tracking={tracking} />*/}
        <div className="sb-letters-only-list">{startingLetterDivs}</div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return generateOutput();
}
