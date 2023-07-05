import { Progress } from "./Progress"
import { HintSection } from "../hints/HintSection"
import { GuessList } from "../guesses/GuessList"

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <GuessList />
      <HintSection />
    </div>
  )
}
