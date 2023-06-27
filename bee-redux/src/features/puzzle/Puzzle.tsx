import { FormEvent, useState } from "react"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { fetchAsync, selectPuzzle } from "./puzzleSlice"
import PuzzleControls from "./PuzzleControls"

export function Puzzle() {
  const data = useAppSelector(selectPuzzle)
  const dispatch = useAppDispatch()

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
    <div className="hive-container">
      {displayData()}
    </div>
  )
}
