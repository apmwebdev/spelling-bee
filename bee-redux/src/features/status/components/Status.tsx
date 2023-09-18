import { Progress } from "./Progress";
import { WordLists } from "@/features/wordLists";
import { AttemptControls } from "@/features/guesses";
import "@/styles/status.scss";

export function Status() {
  return (
    <div className="Status">
      <AttemptControls />
      <Progress />
      <WordLists />
    </div>
  );
}
