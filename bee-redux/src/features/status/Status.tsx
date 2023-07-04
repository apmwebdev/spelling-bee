import { Progress } from "./Progress"
import { Hints } from "../hints/Hints"
import { GuessList } from "../guesses/GuessList"

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <GuessList />
      <Hints />
    </div>
  )
}
