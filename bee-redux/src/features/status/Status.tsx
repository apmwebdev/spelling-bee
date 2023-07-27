import { Progress } from "./Progress";
import { GuessList } from "../guesses/GuessList";

export function Status() {
  return (
    <div className="sb-status">
      <Progress />
      <GuessList />
    </div>
  );
}
