import {
  SearchPanelLocations,
  SearchPanelSearch,
  TrackingOptions,
} from "../../hintProfilesSlice"
import { GridRow } from "../letter/WordLengthGrid"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswerLengths, selectAnswers } from "../../../puzzle/puzzleSlice"
import { selectCorrectGuessWords } from "../../../guesses/guessesSlice"
import { SearchResult } from "./SearchResult"

interface ResultData {
  searchObject: SearchPanelSearch
  results: GridRow
  excludedAnswers: number
}

export interface SearchResultProps {
  panelId?: number
  resultData: ResultData
  tracking: TrackingOptions
}

export function SearchPanelResults({
  panelId,
  results,
  tracking,
}: {
  panelId: number
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

  const content = () => {
    const resultDivs = results.map((searchObject) => {
      const resultData = generateSearchResultData(searchObject)
      return (
        <SearchResult
          panelId={panelId}
          resultData={resultData}
          tracking={tracking}
        />
      )
    })
    return <div className="sb-search-hints-results">{resultDivs}</div>
  }

  return content()
}
