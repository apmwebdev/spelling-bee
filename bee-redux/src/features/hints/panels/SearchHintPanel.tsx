import { HintPanelProps } from "../HintPanel"
import { useAppSelector } from "../../../app/hooks"
import { selectAnswerLengths, selectAnswers } from "../../puzzle/puzzleSlice"
import { FormEvent, useState } from "react"
import { HintPanelSettings } from "../HintPanelSettings"
import { isSearchPanelSettings, SearchPanelLocations, } from '../hintProfilesSlice';
import { selectCorrectGuessWords } from "../../guesses/guessesSlice"
import { GridRow } from "./letter/WordLengthGrid"
import { SearchPanelSettings } from "./search/SearchPanelSettings"

interface ResultsData {
  excludedAnswers: number
  results: GridRow
}

export function SearchHintPanel({ panel }: HintPanelProps) {
  const answers = useAppSelector(selectAnswers)
  const answerLengths = useAppSelector(selectAnswerLengths)
  const correctGuessWords = useAppSelector(selectCorrectGuessWords)
  const [searchValue, setSearchValue] = useState("")

  const search = (): ResultsData | undefined => {
    const createResultsContainer = () => {
      const returnObject: GridRow = {}
      for (const answerLength of answerLengths) {
        returnObject[answerLength] = { answers: 0, guesses: 0 }
      }
      return returnObject
    }
    if (isSearchPanelSettings(panel.typeOptions)) {
      const { searchLocation, offset, display } = panel.typeOptions
      const results = createResultsContainer()
      let excludedAnswers = 0
      for (const answer of answers) {
        if (
          (searchLocation === SearchPanelLocations.Anywhere &&
            searchValue.length > answer.length) ||
          (searchLocation !== SearchPanelLocations.Anywhere &&
            offset + searchValue.length > answer.length)
        ) {
          excludedAnswers++
          continue
        }
        let answerFragment: string
        if (searchLocation === SearchPanelLocations.Beginning) {
          answerFragment = answer.slice(offset, offset + searchValue.length)
        } else if (searchLocation === SearchPanelLocations.End && offset > 0) {
          answerFragment = answer.slice(-searchValue.length - offset, -offset)
        } else if (
          searchLocation === SearchPanelLocations.End &&
          offset === 0
        ) {
          answerFragment = answer.slice(-searchValue.length)
        } else {
          answerFragment = answer
        }
        if (answerFragment.toUpperCase().includes(searchValue.toUpperCase())) {
          results[answer.length].answers++
        }
        if (correctGuessWords.includes(answer.toUpperCase())) {
          results[answer.length].guesses++
        }
      }
      return { excludedAnswers, results }
    }
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const resultsData = search()
    if (resultsData) {
      //do stuff
    }
  }

  const searchSettings = () => (
    <SearchPanelSettings />
  )
  return (
    <>
      <HintPanelSettings panel={panel} TypeSettingsComponent={searchSettings}/>
      <div className="sb-search-hints">
        <form onSubmit={handleSearch}>
          <input
            type="search"
            className="sb-search-hint-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="standard-button">
            Search
          </button>
        </form>
      </div>
    </>
  )
}
