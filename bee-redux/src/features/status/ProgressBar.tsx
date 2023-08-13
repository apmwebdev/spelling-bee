import { Rank, selectRanks } from "../puzzle/puzzleSlice";
import { useAppSelector } from "../../app/hooks";
import uniqid from "uniqid";

export function ProgressBar({ currentRank }: { currentRank: Rank }) {
  const ranks = useAppSelector(selectRanks);
  return (
    <div className="ProgressBar">
      {ranks.map((rank) => {
        return (
          <div
            key={uniqid()}
            className={`rank-tic${rank === currentRank ? " active" : ""}`}
          ></div>
        );
      })}
    </div>
  );
}
