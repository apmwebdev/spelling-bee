import { Puzzle } from "@/features/puzzle/Puzzle";
import { Status } from "@/features/status/Status";
import { Hints } from "@/features/hints";
import { useLazyGetCurrentAttemptsQuery } from "@/features/guesses/guessesApiSlice";
import { useEffect } from "react";
import { useCurrentPuzzle } from "@/features/puzzle/useCurrentPuzzle";
import { useLazyGetUserPuzzleDataQuery } from "@/features/userData/userDataApiSlice";

export function PuzzleRoute() {
  const puzzleQ = useCurrentPuzzle();
  const [getUserPuzzleData] = useLazyGetUserPuzzleDataQuery();

  useEffect(() => {
    if (puzzleQ.isSuccess) {
      getUserPuzzleData(puzzleQ.data.id);
    }
  }, [getUserPuzzleData, puzzleQ]);

  return (
    <div className="sb-main-container">
      <div className="sb-main">
        <Status />
        <Puzzle />
        <Hints />
      </div>
    </div>
  );
}
