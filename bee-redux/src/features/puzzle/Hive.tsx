import React, { FC } from "react"
import LetterCell from "./LetterCell"
import { useAppSelector } from "../../app/hooks"
import { selectPuzzle } from "./puzzleSlice"

const Hive: FC = () => {
  const puzzle = useAppSelector(selectPuzzle)
  let contents
  if (!puzzle) {
    contents = <div className="hive">No content</div>
  } else {
    contents = (
      <div className="hive">
        <LetterCell letter={puzzle.centerLetter} isCenter={true} />
        {puzzle.outerLetters.map((letter) => {
          return <LetterCell key={letter} letter={letter} isCenter={false} />
        })}
      </div>
    )
  }
  return <div className="hive-container">{contents}</div>
}

export default Hive
