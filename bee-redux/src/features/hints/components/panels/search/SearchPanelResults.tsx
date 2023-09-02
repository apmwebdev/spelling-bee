import { useAppSelector } from "@/app/hooks";
import {
  selectAnswerLengths,
  selectAnswerWords,
} from "@/features/puzzle/puzzleSlice";
import { selectKnownWords } from "@/features/guesses/guessesSlice";
import { SearchResult } from "./SearchResult";
import uniqid from "uniqid";
import {
  createSubstringHintDataCell,
  GridRow,
  SearchPanelLocationKeys,
  SearchPanelSearchData,
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hints";

interface ResultData {
  searchObject: SearchPanelSearchData;
  results: GridRow;
  total: SubstringHintDataCell;
  excludedAnswers: number;
}

export interface SearchResultProps {
  panelId?: number;
  resultData: ResultData;
  statusTracking: StatusTrackingKeys;
}

export function SearchPanelResults({
  searches,
  tracking,
}: {
  searches: SearchPanelSearchData[];
  tracking: StatusTrackingKeys;
}) {
  const answers = useAppSelector(selectAnswerWords);
  const answerLengths = useAppSelector(selectAnswerLengths);
  const knownWords = useAppSelector(selectKnownWords);

  const generateSearchResultData = (
    searchObject: SearchPanelSearchData,
  ): ResultData => {
    const createResultsContainer = () => {
      const returnObject: GridRow = {};
      for (const answerLength of answerLengths) {
        returnObject[answerLength] = createSubstringHintDataCell();
      }
      return returnObject;
    };
    const { searchString, location, lettersOffset } = searchObject;
    const results = createResultsContainer();
    const total = createSubstringHintDataCell();
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
      } else if (
        location === SearchPanelLocationKeys.End &&
        lettersOffset > 0
      ) {
        answerFragment = answer.slice(
          -searchString.length - lettersOffset,
          -lettersOffset,
        );
      } else if (
        location === SearchPanelLocationKeys.End &&
        lettersOffset === 0
      ) {
        answerFragment = answer.slice(-searchString.length);
      } else {
        answerFragment = answer;
      }
      if (answerFragment.includes(searchString)) {
        results[answer.length].answers++;
        total.answers++;
        if (knownWords.includes(answer)) {
          results[answer.length].guesses++;
          total.guesses++;
        }
      }
    }
    return { searchObject, results, total, excludedAnswers };
  };

  const content = () => {
    const resultDivs = searches.map((searchObject) => {
      const resultData = generateSearchResultData(searchObject);
      return (
        <SearchResult
          key={uniqid()}
          resultData={resultData}
          statusTracking={tracking}
        />
      );
    });
    return (
      <div className="sb-search-hints-results">{resultDivs}</div>
    );
  };

  return content();
}
