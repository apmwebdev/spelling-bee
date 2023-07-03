import { Progress } from "./Progress"
import { FoundWords } from "./FoundWords"
import { Hints } from "./Hints"
import { GuessesList } from "../guesses/GuessesList"

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <GuessesList />
      <Hints />
    </div>
  )
}
