import uniqid from "uniqid";
import { Rank, RanksType } from "../puzzle/puzzleApiSlice";

export function ProgressBar({
  ranks,
  currentRank,
}: {
  ranks: RanksType | [Rank];
  currentRank: Rank;
}) {
  return (
    <div className="ProgressBar">
      {ranks.map((rank) => {
        return (
          <div
            key={uniqid()}
            className={`RankTic${rank === currentRank ? " active" : ""}`}
          ></div>
        );
      })}
    </div>
  );
}
