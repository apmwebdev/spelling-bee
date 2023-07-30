import { Progress } from "./Progress";
import { WordList } from "../guesses/WordList";

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <WordList />
    </div>
  );
}
