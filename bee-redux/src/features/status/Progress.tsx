import { useAppSelector } from "../../app/hooks";
import { Rank, selectRanks, selectTotalPoints } from "../puzzle/puzzleSlice";
import { selectScore } from "../guesses/guessesSlice";
import { ProgressBar } from "./ProgressBar";

export function Progress() {
  const ranks = useAppSelector(selectRanks);
  const score = useAppSelector(selectScore);
  const totalPoints = useAppSelector(selectTotalPoints);

  const currentRank = (): Rank => {
    if (totalPoints === 0) return ranks[0];
    let returnRank = ranks[0];
    for (const [i, rank] of ranks.entries()) {
      if (score === rank.score || score < ranks[i + 1].score) {
        returnRank = rank;
        break;
      }
    }
    return returnRank;
  };

  return (
    <div className="Progress">
      <span>Rank:</span>
      {currentRank().name}
      <ProgressBar currentRank={currentRank()} />
    </div>
  );
}
