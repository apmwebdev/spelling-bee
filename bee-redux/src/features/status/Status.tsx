import { Progress } from "./Progress";
import { WordLists } from "../wordLists/WordLists";
import { AttemptControls } from "@/features/guesses/AttemptControls";
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
