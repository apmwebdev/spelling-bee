import { Guess } from "../guesses/Guess"
import Hive from "./Hive"
import { GuessList } from "../guesses/GuessList"

export function Puzzle() {
  return (
    <div className="sb-controls-container">
      <div className="sb-controls">
        <Guess />
        <Hive />
      </div>
      <GuessList />
    </div>
  )
}
