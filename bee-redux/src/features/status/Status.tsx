import { Progress } from "./Progress";
import { WordLists } from "../wordLists/WordLists";

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <WordLists />
    </div>
  );
}
