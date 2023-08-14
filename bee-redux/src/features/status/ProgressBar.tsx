import uniqid from "uniqid";
import { Rank } from "../puzzle/puzzleApiSlice";
import { useCurrentPuzzle } from "../puzzle/useCurrentPuzzle";

export function ProgressBar({ currentRank }: { currentRank?: Rank }) {
  const ranks = useCurrentPuzzle().ranks;

  const cssClasses = (rank: Rank) => {
    let classNames = "rank-tic";
    if (!currentRank) return classNames + " skeleton";
    if (rank === currentRank) return classNames + " active";
    return classNames;
  };

  return (
    <div className="ProgressBar">
      {ranks.map((rank) => {
        return <div key={uniqid()} className={cssClasses(rank)}></div>;
      })}
    </div>
  );
}
