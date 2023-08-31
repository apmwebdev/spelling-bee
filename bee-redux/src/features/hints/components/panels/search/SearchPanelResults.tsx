import { GridRow } from "../letter/WordLengthGridContainer";
import { useAppSelector } from "@/app/hooks";
import {
  selectAnswerLengths,
  selectAnswerWords,
} from "@/features/puzzle/puzzleSlice";
import { selectCorrectGuessWords } from "@/features/guesses/guessesSlice";
import { SearchResult } from "./SearchResult";
import uniqid from "uniqid";
import {
  SearchPanelLocationKeys,
  SearchPanelSearch,
  StatusTrackingKeys,
} from "@/features/hints";

interface ResultData {
  searchObject: SearchPanelSearch;
  results: GridRow;
  excludedAnswers: number;
}

export interface SearchResultProps {
  panelId?: number;
  resultData: ResultData;
  tracking: StatusTrackingKeys;
}

export function SearchPanelResults({
  panelId,
  results,
  tracking,
}: {
  panelId: number;
  results: SearchPanelSearch[];
  tracking: StatusTrackingKeys;
}) {
  const answers = useAppSelector(selectAnswerWords);
  const answerLengths = useAppSelector(selectAnswerLengths);
  const correctGuessWords = useAppSelector(selectCorrectGuessWords);

  const generateSearchResultData = (
    searchObject: SearchPanelSearch,
  ): ResultData => {
    const createResultsContainer = () => {
      const returnObject: GridRow = {};
      for (const answerLength of answerLengths) {
        returnObject[answerLength] = { answers: 0, guesses: 0 };
      }
      return returnObject;
    };
    const { searchString, location, lettersOffset } = searchObject;
    const results = createResultsContainer();
    let excludedAnswers = 0;
    for (const answer of answers) {
      if (
        (location === SearchPanelLocationKeys.Anywhere &&
          searchString.length > answer.length) ||
        (location !== SearchPanelLocationKeys.Anywhere &&
          lettersOffset + searchString.length > answer.length)
      ) {
        excludedAnswers++;
        continue;
      }
      let answerFragment: string;
      if (location === SearchPanelLocationKeys.Start) {
        answerFragment = answer.slice(
          lettersOffset,
          lettersOffset + searchString.length,
        );
      } else if (location === SearchPanelLocationKeys.End && lettersOffset > 0) {
        answerFragment = answer.slice(
          -searchString.length - lettersOffset,
          -lettersOffset,
        );
      } else if (location === SearchPanelLocationKeys.End && lettersOffset === 0) {
        answerFragment = answer.slice(-searchString.length);
      } else {
        answerFragment = answer;
      }
      if (answerFragment.includes(searchString)) {
        results[answer.length].answers++;
        if (correctGuessWords.includes(answer)) {
          results[answer.length].guesses++;
        }
      }
    }
    return { searchObject, results, excludedAnswers };
  };

  const content = () => {
    const resultDivs = results.map((searchObject) => {
      const resultData = generateSearchResultData(searchObject);
      return (
        <SearchResult
          key={uniqid()}
          panelId={panelId}
          resultData={resultData}
          tracking={tracking}
        />
      );
    });
    return <div className="sb-search-hints-results">{resultDivs}</div>;
  };

  return content();
}
