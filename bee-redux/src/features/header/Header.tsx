import { FormEvent, useState } from "react"

import { useNavigate } from "react-router-dom"
import { useAppSelector } from '../../app/hooks';
import {
  PuzzleStatuses,
  selectDate,
  selectPuzzle,
  selectPuzzleStatus
} from '../puzzle/puzzleSlice';

export function Header() {
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("")
  const navigate = useNavigate()
  const status = useAppSelector(selectPuzzleStatus)
  const puzzleDate = useAppSelector(selectDate)

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    return navigate(`/puzzle/${puzzleIdentifier}`)
  }

  const subheaderText = () => {
    if (status === PuzzleStatuses.Succeeded) {
      return `Spelling Bee for ${puzzleDate}`
    }
    return "No puzzle to show"
  }

  return (
    <header className="sb-header">
      <div className="title">{subheaderText()}</div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="identifierInput"
          value={puzzleIdentifier}
          placeholder="Date, ID, or letters"
          onChange={(e) => setPuzzleIdentifier(e.target.value)}
        />
        <button type="submit" className="standard-button">
          Find Puzzle
        </button>
      </form>
    </header>
  )
}
