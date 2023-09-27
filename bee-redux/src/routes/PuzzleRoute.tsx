import { useEffect } from "react";
import { useCurrentPuzzle } from "@/features/puzzle";
import { useLazyGetUserPuzzleDataQuery } from "@/features/userData";
import { Status } from "@/routes/puzzleRoutePageSections/Status";
import { Hints } from "@/routes/puzzleRoutePageSections/Hints";
import { Puzzle } from "@/routes/puzzleRoutePageSections/Puzzle";

export function PuzzleRoute() {
  const puzzleQ = useCurrentPuzzle();
  const [getUserPuzzleData] = useLazyGetUserPuzzleDataQuery();

  useEffect(() => {
    if (puzzleQ.isSuccess) {
      getUserPuzzleData(puzzleQ.data.id);
    }
  }, [getUserPuzzleData, puzzleQ]);

  return (
    <div className="PuzzleMainContainer">
      <div className="PuzzleMain">
        <Status />
        <Puzzle />
        <Hints />
      </div>
    </div>
  );
}
