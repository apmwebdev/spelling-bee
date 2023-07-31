import { useAppSelector } from "../../app/hooks";
import { selectRanks } from "../puzzle/puzzleSlice";
import { selectScore } from "../guesses/guessesSlice";

export function Progress() {
  const ranks = useAppSelector(selectRanks);
  const currentPoints = useAppSelector(selectScore);
  return <div className="sb-progress">progress</div>;
}
