import { Puzzle } from "@/features/puzzle/components/Puzzle";
import { Status } from "@/features/status/components/Status";
import { Hints } from "@/features/hints";
import { useEffect } from "react";
import { useCurrentPuzzle } from "@/features/puzzle/hooks/useCurrentPuzzle";
import { useLazyGetUserPuzzleDataQuery } from "@/features/userData/api/userDataApiSlice";

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
