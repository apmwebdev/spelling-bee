import { FormEvent, useState } from "react"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { fetchAsync, selectPuzzle } from "./puzzleSlice"
import PuzzleControls from "./PuzzleControls"

export function Puzzle() {
  const data = useAppSelector(selectPuzzle)
  const dispatch = useAppDispatch()
  const [puzzleDate, setPuzzleDate] = useState("2023-06-20")

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(fetchAsync(puzzleDate))
  }

  const displayData = () => {
    let retVal
    if (!data) {
      retVal = "blank"
    } else {
      retVal = (
        <PuzzleControls
          centerLetter={data.centerLetter}
          otherLetters={data.outerLetters}
        />
      )
    }
    return retVal
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="dateInput"
          value={puzzleDate}
          onChange={(e) => setPuzzleDate(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {displayData()}
    </div>
  )
}
