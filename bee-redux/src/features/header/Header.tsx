import { FormEvent, useState } from "react"

import { useAppDispatch } from "../../app/hooks"
import { fetchPuzzleAsync } from "../puzzle/puzzleSlice"

export function Header() {
  const dispatch = useAppDispatch()
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("2023-06-20")

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(fetchPuzzleAsync(puzzleIdentifier))
  }

  return (
    <header className="sb-header">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="identifierInput"
          value={puzzleIdentifier}
          onChange={(e) => setPuzzleIdentifier(e.target.value)}
        />
        <button type="submit" className="standard-button">
          Submit
        </button>
      </form>
    </header>
  )
}
