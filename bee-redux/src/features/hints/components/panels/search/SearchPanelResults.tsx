import {
  SearchPanelLocations,
  SearchPanelSearch,
} from "../../../hintProfilesSlice";
import { GridRow } from "../letter/WordLengthGrid";
import { useAppSelector } from "@/app/hooks";
import {
  selectAnswerLengths,
  selectAnswerWords,
} from "@/features/puzzle/puzzleSlice";
import { selectCorrectGuessWords } from "@/features/guesses/guessesSlice";
import { SearchResult } from "./SearchResult";
import uniqid from "uniqid";
import { StatusTrackingOptions } from "@/features/hints";

interface ResultData {
  searchObject: SearchPanelSearch;
  results: GridRow;
  excludedAnswers: number;
}

export interface SearchResultProps {
  panelId?: number;
  resultData: ResultData;
  tracking: StatusTrackingOptions;
}

export function SearchPanelResults({
  panelId,
  results,
  tracking,
}: {
  panelId: number;
  results: SearchPanelSearch[];
  tracking: StatusTrackingOptions;
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
    const { searchString, searchLocation, offset } = searchObject;
    const results = createResultsContainer();
    let excludedAnswers = 0;
    for (const answer of answers) {
      if (
        (searchLocation === SearchPanelLocations.Anywhere &&
          searchString.length > answer.length) ||
        (searchLocation !== SearchPanelLocations.Anywhere &&
          offset + searchString.length > answer.length)
      ) {
        excludedAnswers++;
        continue;
      }
      let answerFragment: string;
      if (searchLocation === SearchPanelLocations.Beginning) {
        answerFragment = answer.slice(offset, offset + searchString.length);
      } else if (searchLocation === SearchPanelLocations.End && offset > 0) {
        answerFragment = answer.slice(-searchString.length - offset, -offset);
      } else if (searchLocation === SearchPanelLocations.End && offset === 0) {
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
