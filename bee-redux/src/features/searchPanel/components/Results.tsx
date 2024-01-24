/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths, selectAnswerWords } from "@/features/puzzle";
import {
  Result,
  ResultData,
  SearchPanelSearchData,
} from "@/features/searchPanelSearches";
import uniqid from "uniqid";
import {
  createSubstringHintDataCell,
  GridRow,
  StatusTrackingKeys,
} from "@/features/hintPanels";
import { SearchPanelLocationKeys } from "..";
import { selectKnownAnswerWords } from "@/features/progress/api/progressSelectors";

export function Results({
  searches,
  tracking,
}: {
  searches: SearchPanelSearchData[];
  tracking: StatusTrackingKeys;
}) {
  const answers = useAppSelector(selectAnswerWords);
  const answerLengths = useAppSelector(selectAnswerLengths);
  const knownWords = useAppSelector(selectKnownAnswerWords);

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
        <Result
          key={uniqid()}
          resultData={resultData}
          statusTracking={tracking}
        />
      );
    });
    return <div className="SearchPanelResults">{resultDivs}</div>;
  };

  return content();
}
