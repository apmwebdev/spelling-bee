import Hive from "./Hive"
import { Guess } from ".././guesses/Guess"

export function Puzzle() {
  return (
    <div className="sb-controls-container">
      <div className="sb-controls">
        <Guess />
        <Hive />
      </div>
    </div>
  )
}
