import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "../LetterHintPanel";
import { LetterPanelLocations, TrackingOptions } from "../../hintProfilesSlice";
import uniqid from "uniqid";
import { WordLengthGridKey } from "./WordLengthGridKey";

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

export const generateData = ({
  answers,
  correctGuessWords,
  numberOfLetters,
  locationInWord,
  offset,
}: LetterHintSubsectionProps): ListData => {
  const listRows: ListRows = {};
  let excludedAnswers = 0;

  for (const answer of answers) {
    if (offset + numberOfLetters > answer.length) {
      excludedAnswers++;
      continue;
    }
    let answerFragment: string;
    if (locationInWord === LetterPanelLocations.Beginning) {
      answerFragment = answer.slice(offset, offset + numberOfLetters);
    } else if (offset > 0) {
      answerFragment = answer.slice(-numberOfLetters - offset, -offset);
    } else {
      answerFragment = answer.slice(-numberOfLetters);
    }
    const startingLetter = answerFragment.charAt(0);
    if (listRows[startingLetter] === undefined) {
      listRows[startingLetter] = {};
    }
    if (listRows[startingLetter][answerFragment] === undefined) {
      listRows[startingLetter][answerFragment] = { answers: 0, guesses: 0 };
    }
    listRows[startingLetter][answerFragment].answers++;
    if (correctGuessWords.includes(answer)) {
      listRows[startingLetter][answerFragment].guesses++;
    }
  }
  return { excludedAnswers, listRows };
};
export function WordCountList({
  answers,
  correctGuessWords,
  numberOfLetters,
  locationInWord,
  offset,
  tracking,
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

      const cellText = () => {
        switch (tracking) {
          case TrackingOptions.RemainingOfTotal:
            return `${remaining}/${total}`;
          case TrackingOptions.FoundOfTotal:
            return `${found}/${total}`;
          case TrackingOptions.Remaining:
            return `${remaining}`;
          case TrackingOptions.Found:
            return `${found}`;
          case TrackingOptions.Total:
            return `${total}`;
        }
      };

      const cellClasses = () => {
        let classList = "sb-wcl-fragment-count";
        if (tracking === TrackingOptions.Total) {
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
          <div className={cellClasses()}>{cellText()}</div>
        </div>,
      );
    };

    const { excludedAnswers, listRows } = generateData({
      answers,
      correctGuessWords,
      numberOfLetters,
      locationInWord,
      offset,
      tracking,
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
        <WordLengthGridKey tracking={tracking} />
        <div className="sb-word-count-list">{startingLetterDivs}</div>
        <div>Excluded words: {excludedAnswers}</div>
      </div>
    );
  };

  return generateOutput();
}
