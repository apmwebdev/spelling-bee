import { useAppSelector } from "../../app/hooks";
import { Rank } from "../puzzle/puzzleApiSlice";
import { selectScore } from "../guesses/guessesSlice";
import { ProgressBar } from "./ProgressBar";
import { FoundWordsStatus } from "../guesses/wordList/foundWords/FoundWordsStatus";
import { useCurrentPuzzle } from "../puzzle/useCurrentPuzzle";

export function Progress() {
  const puzzle = useCurrentPuzzle();
  const ranks = puzzle.ranks;
  const score = useAppSelector(selectScore);
  const totalPoints = puzzle.totalPoints;

  if (!puzzle.status.isSuccess || score > totalPoints) {
    return (
      <div className="Progress">
        <div className="progress-rank">
          <ProgressBar />
        </div>
        <FoundWordsStatus />
      </div>
    );
  }

  const currentRank = (): Rank => {
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
      <div className="progress-rank">
        <div className="current-rank">{currentRank().name}</div>
        <ProgressBar currentRank={currentRank()} />
      </div>
      <FoundWordsStatus />
    </div>
  );
}
