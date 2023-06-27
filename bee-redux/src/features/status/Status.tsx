import { Progress } from "./Progress"
import { FoundWords } from "./FoundWords"
import { Hints } from "./Hints"

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <FoundWords />
      <Hints />
    </div>
  )
}
