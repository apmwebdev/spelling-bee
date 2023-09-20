import { Progress } from "./Progress";
import { WordLists } from "@/features/wordLists";
import "@/styles/status.scss";
import { AttemptControls } from "@/features/guesses";

export function Status() {
  return (
    <div className="Status">
      <Progress />
      <WordLists />
      <AttemptControls />
    </div>
  );
}
