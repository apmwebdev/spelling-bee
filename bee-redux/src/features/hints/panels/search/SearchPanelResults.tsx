import {
  SearchPanelLocations,
  SearchPanelSearch,
  StringHintDisplayOptions,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { GridRow } from "../letter/WordLengthGrid"
import { SearchResultWordLengths } from "./SearchResultWordLengths"
import { SearchResultWordCount } from "./SearchResultWordCount"
import { SearchResultLettersOnly } from "./SearchResultLettersOnly"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswerLengths, selectAnswers } from "../../../puzzle/puzzleSlice"
import { selectCorrectGuessWords } from "../../../guesses/guessesSlice"

interface ResultData {
  searchObject: SearchPanelSearch
  results: GridRow
  excludedAnswers: number
}

export interface SearchPanelResultSubsectionProps {
  resultData: ResultData
  tracking: TrackingOptions
}

export function SearchPanelResults({
  results,
  tracking,
}: {
  results: SearchPanelSearch[]
  tracking: TrackingOptions
}) {
  const answers = useAppSelector(selectAnswers)
  const answerLengths = useAppSelector(selectAnswerLengths)
  const correctGuessWords = useAppSelector(selectCorrectGuessWords)

  const generateSearchResultData = (
    searchObject: SearchPanelSearch,
  ): ResultData => {
    const createResultsContainer = () => {
      const returnObject: GridRow = {}
      for (const answerLength of answerLengths) {
        returnObject[answerLength] = { answers: 0, guesses: 0 }
      }
      return returnObject
    }
    const { searchString, searchLocation, offset, display } = searchObject
    const results = createResultsContainer()
    let excludedAnswers = 0
    for (const answer of answers) {
      if (
        (searchLocation === SearchPanelLocations.Anywhere &&
          searchString.length > answer.length) ||
        (searchLocation !== SearchPanelLocations.Anywhere &&
          offset + searchString.length > answer.length)
      ) {
        excludedAnswers++
        continue
      }
      let answerFragment: string
      if (searchLocation === SearchPanelLocations.Beginning) {
        answerFragment = answer.slice(offset, offset + searchString.length)
      } else if (searchLocation === SearchPanelLocations.End && offset > 0) {
        answerFragment = answer.slice(-searchString.length - offset, -offset)
      } else if (searchLocation === SearchPanelLocations.End && offset === 0) {
        answerFragment = answer.slice(-searchString.length)
      } else {
        answerFragment = answer
      }
      if (answerFragment.toUpperCase().includes(searchString.toUpperCase())) {
        results[answer.length].answers++
      }
      if (correctGuessWords.includes(answer.toUpperCase())) {
        results[answer.length].guesses++
      }
    }
    return { searchObject, results, excludedAnswers }
  }

  const generateSearchResultOutput = (searchObject: SearchPanelSearch) => {
    const resultData = generateSearchResultData(searchObject)
    switch (resultData.searchObject.display) {
      case StringHintDisplayOptions.WordLengthGrid:
        return (
          <SearchResultWordLengths
            resultData={resultData}
            tracking={tracking}
          />
        )
      case StringHintDisplayOptions.WordCountList:
        return (
          <SearchResultWordCount resultData={resultData} tracking={tracking} />
        )
      case StringHintDisplayOptions.LettersOnly:
        return (
          <SearchResultLettersOnly
            resultData={resultData}
            tracking={tracking}
          />
        )
    }
  }

  const content = () => {
    const resultDivs = results.map((searchObject) => {
      return generateSearchResultOutput(searchObject)
    })
    return <div className="sb-search-hints-results">{resultDivs}</div>
  }
  return content()
}
