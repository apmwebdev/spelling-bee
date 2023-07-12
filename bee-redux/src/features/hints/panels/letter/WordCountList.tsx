import {
  LetterHintDataCell,
  LetterHintSubsectionProps,
} from "../LetterHintPanel"
import { LetterPanelLocations, TrackingOptions } from "../../hintProfilesSlice"
import uniqid from "uniqid"
import { WordLengthGridKey } from "./WordLengthGridKey"

interface ListRow {
  [substring: string]: LetterHintDataCell
}

interface ListRows {
  [startingLetter: string]: ListRow
}

interface ListData {
  excludedAnswers: number
  listRows: ListRows
}

export function WordCountList({
  answers,
  correctGuessWords,
  numberOfLetters,
  locationInWord,
  offset,
  tracking,
}: LetterHintSubsectionProps) {
  const generateData = (): ListData => {
    const listRows: ListRows = {}
    let excludedAnswers = 0

    for (const answer of answers) {
      if (offset + numberOfLetters > answer.length) {
        excludedAnswers++
        continue
      }
      let answerFragment: string
      if (locationInWord === LetterPanelLocations.Beginning) {
        answerFragment = answer.slice(offset, offset + numberOfLetters)
      } else if (offset > 0) {
        answerFragment = answer.slice(-numberOfLetters - offset, -offset)
      } else {
        answerFragment = answer.slice(-numberOfLetters)
      }
      const startingLetter = answerFragment.charAt(0)
      if (listRows[startingLetter] === undefined) {
        listRows[startingLetter] = {}
      }
      if (listRows[startingLetter][answerFragment] === undefined) {
        listRows[startingLetter][answerFragment] = { answers: 0, guesses: 0 }
      }
      listRows[startingLetter][answerFragment].answers++
      if (correctGuessWords.includes(answer.toUpperCase())) {
        listRows[startingLetter][answerFragment].guesses++
      }
    }
    return { excludedAnswers, listRows }
  }

  const generateOutput = () => {
    const createCell = ({
      cell,
      fragment,
      fragmentDivs,
    }: {
      cell: LetterHintDataCell
      fragment: string
      fragmentDivs: any[]
    }) => {
      const found = cell.guesses
      const total = cell.answers
      const remaining = total - found

      const cellText = () => {
        switch (tracking) {
          case TrackingOptions.RemainingOfTotal:
            return `${remaining}/${total}`
          case TrackingOptions.FoundOfTotal:
            return `${found}/${total}`
          case TrackingOptions.Remaining:
            return `${remaining}`
          case TrackingOptions.Found:
            return `${found}`
          case TrackingOptions.Total:
            return `${total}`
        }
      }

      const cellClasses = () => {
        let classList = "sb-wcl-fragment-count"
        if (tracking === TrackingOptions.Total) {
          return classList
        }
        if (cell.guesses === cell.answers) {
          classList += " hint-completed"
        } else if (cell.guesses === 0) {
          classList += " hint-not-started"
        } else {
          classList += " hint-in-progress"
        }
        return classList
      }

      fragmentDivs.push(
        <div key={uniqid()} className="sb-wcl-fragment-cell">
          <div className="sb-wcl-fragment-label">{fragment}</div>
          <div className={cellClasses()}>{cellText()}</div>
        </div>,
      )
    }

    const { excludedAnswers, listRows } = generateData()
    const sortedKeys = Object.keys(listRows).sort()
    const startingLetterDivs = []
    // let maxNumberOfFragments: number = 0

    for (const startingLetter of sortedKeys) {
      const listRow = listRows[startingLetter]
      // if (Object.values(listRow).length > maxNumberOfFragments) {
      //   maxNumberOfFragments = Object.values(listRow).length
      // }
      const sortedFragments = Object.keys(listRow).sort()
      const fragmentDivs: any[] = []

      for (const fragment of sortedFragments) {
        const dataCell = listRow[fragment]
        createCell({ cell: dataCell, fragment, fragmentDivs })
      }
      startingLetterDivs.push(
        <div key={uniqid()} className="sb-wcl-row">
          {fragmentDivs}
        </div>,
      )
    }

    // const gridStyle = {
    //   gridTemplateColumns: `repeat(${maxNumberOfFragments * 2}, max-content)`,
    // }
    return (
      <div key={uniqid()} className="sb-word-count-list-container">
        <WordLengthGridKey tracking={tracking} />
        <div key={uniqid()} className="sb-word-count-list">
          {startingLetterDivs}
        </div>
        <div key={uniqid()}>Excluded words: {excludedAnswers}</div>
      </div>
    )
  }

  return generateOutput()
}
