import { useAppSelector } from "@/app/hooks";
import { BlankRank, Rank, useCurrentPuzzle } from "@/features/puzzle";
import { selectScore } from "@/features/guesses";
import { ProgressBar } from "./ProgressBar";
import { FoundWordsStatus } from "@/features/wordLists/components/foundWords/FoundWordsStatus";

export function Progress() {
  const puzzleQ = useCurrentPuzzle();
  const ranks = puzzleQ.data?.ranks ?? [BlankRank];
  const score = useAppSelector(selectScore);
  const totalPoints = puzzleQ.data?.totalPoints ?? 0;

  const currentRank = (): Rank => {
    if (!puzzleQ.isSuccess || score > totalPoints) {
      return ranks[0];
    }
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
      <div className="ProgressRank">
        <div className="CurrentRank">{currentRank().name}</div>
        <ProgressBar ranks={ranks} currentRank={currentRank()} />
      </div>
      <FoundWordsStatus />
    </div>
  );
}
