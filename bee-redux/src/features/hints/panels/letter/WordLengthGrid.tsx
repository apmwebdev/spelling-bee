import { LetterHintSubsectionProps } from "../LetterHintPanel"
import { LetterPanelLocations, TrackingOptions } from "../../hintProfilesSlice"
import { useAppSelector } from "../../../../app/hooks"
import { selectAnswerLengths } from "../../../puzzle/puzzleSlice"
import uniqid from "uniqid"

interface GridCell {
  answers: number
  guesses: number
}

interface GridRow {
  [index: number]: GridCell
}

interface GridRows {
  [substring: string]: GridRow
}

interface GridData {
  excludedAnswers: number
  gridRows: GridRows
  totalRow: GridRow
}

export function WordLengthGrid({
  answers,
  correctGuessWords,
  numberOfLetters,
  locationInWord,
  offset,
  tracking,
}: LetterHintSubsectionProps) {
  const answerLengths = useAppSelector(selectAnswerLengths)

  const generateData = (): GridData => {
    const generateRowObject = () => {
      const returnObj: GridRow = {}
      for (const answerLength of answerLengths) {
        returnObj[answerLength] = { answers: 0, guesses: 0 }
      }
      return returnObj
    }

    const gridRows: GridRows = {}
    const totalRow = generateRowObject()
    let excludedAnswers = 0

    for (const answer of answers) {
      if (offset + numberOfLetters > answer.length) {
        excludedAnswers++
        continue
      }
      let substring: string
      if (locationInWord === LetterPanelLocations.Beginning) {
        substring = answer.slice(offset, offset + numberOfLetters)
      } else if (offset > 0) {
        substring = answer.slice(-numberOfLetters - offset, -offset)
      } else {
        substring = answer.slice(-numberOfLetters)
      }
      if (gridRows[substring] === undefined) {
        gridRows[substring] = generateRowObject()
      }
      gridRows[substring][answer.length].answers++
      totalRow[answer.length].answers++
      if (correctGuessWords.includes(answer.toUpperCase())) {
        gridRows[substring][answer.length].guesses++
        totalRow[answer.length].guesses++
      }
    }
    return { excludedAnswers, gridRows, totalRow }
  }

  const generateOutput = () => {
    const { excludedAnswers, gridRows, totalRow } = generateData()
    const numberOfRows = Object.keys(gridRows).length + 3
    const numberOfColumns = Object.keys(Object.values(gridRows)[0]).length + 2
    const gridStyle = {
      gridTemplateRows: `repeat(${numberOfRows}, 1fr)`,
      gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
    }
    const gridArr = []

    const populateGridCellContent = (cell: GridCell) => {
      const found = cell.guesses
      const total = cell.answers
      const remaining = total - found
      if (total === 0) {
        gridArr.push(<div key={uniqid()}>-</div>)
        return
      }
      switch (tracking) {
        case TrackingOptions.RemainingOfTotal:
          gridArr.push(
            <div key={uniqid()}>
              {remaining}/{total}
            </div>,
          )
          break
        case TrackingOptions.FoundOfTotal:
          gridArr.push(
            <div key={uniqid()}>
              {found}/{total}
            </div>,
          )
          break
        case TrackingOptions.Remaining:
          gridArr.push(<div key={uniqid()}>{remaining}</div>)
          break
        case TrackingOptions.Found:
          gridArr.push(<div key={uniqid()}>{found}</div>)
          break
        case TrackingOptions.Total:
          gridArr.push(<div key={uniqid()}>{total}</div>)
      }
    }

    const populateGridArrayContent = (row: GridRow) => {
      for (const cell in row) {
        populateGridCellContent(row[cell])
      }
    }

    gridArr.push(
      <div className="sb-word-length-grid-y-label" key={uniqid()}>
        Letters
      </div>,
    )
    gridArr.push(
      <div
        className="sb-word-length-grid-x-label"
        style={{ gridColumn: `2 / ${numberOfColumns + 1}` }}
        key={uniqid()}
      >
        Word Length →
      </div>,
    )
    gridArr.push(<div key={uniqid()}>↓</div>)
    for (const num of answerLengths) {
      gridArr.push(<div key={uniqid()}>{num}</div>)
    }
    gridArr.push(<div key={uniqid()}>Total</div>)
    for (const property in gridRows) {
      gridArr.push(<div key={uniqid()}>{property}</div>)
      populateGridArrayContent(gridRows[property])
      const rowAnswerTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.answers,
        0,
      )
      const rowGuessTotal = Object.values(gridRows[property]).reduce(
        (sum, cell) => sum + cell.guesses,
        0,
      )
      populateGridCellContent({
        answers: rowAnswerTotal,
        guesses: rowGuessTotal,
      })
    }
    gridArr.push(<div key={uniqid()}>Total</div>)
    populateGridArrayContent(totalRow)
    const answerGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.answers,
      0,
    )
    const guessGrandTotal = Object.values(totalRow).reduce(
      (sum, cell) => sum + cell.guesses,
      0,
    )
    populateGridCellContent({
      answers: answerGrandTotal,
      guesses: guessGrandTotal,
    })
    return (
      <div className="sb-word-length-grid-container">
        {/*<table>{outputArr}</table>*/}
        <div className="sb-word-length-grid" style={gridStyle}>
          {gridArr}
        </div>
        <div key={uniqid()}>Excluded words: {excludedAnswers}</div>
      </div>
    )
  }
  return generateOutput()
}
