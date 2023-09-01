import { Progress } from "./Progress";
import { WordLists } from "../wordLists/WordLists";
import { AttemptControls } from "@/features/guesses/AttemptControls";

export function Status() {
  return (
    <div className="sb-status">
      <AttemptControls />
      <Progress />
      <WordLists />
    </div>
  );
}
