import React, { FC } from "react"
import LetterCell from "./LetterCell"

interface PuzzleProps {
  centerLetter: string
  otherLetters: Array<string>
}

const Puzzle: FC<PuzzleProps> = (props) => {
  return (
    <div className="hive">
      <LetterCell letter={props.centerLetter} isCenter={true} />
      {props.otherLetters.map((letter) => {
        return <LetterCell key={letter} letter={letter} isCenter={false} />
      })}
    </div>
  )
}

export default Puzzle
