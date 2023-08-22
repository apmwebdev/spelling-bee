import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { Hints } from "../features/hints/components/Hints";
import { useLazyGetCurrentAttemptsQuery } from "../features/guesses/guessesApiSlice";
import { useEffect } from "react";
import { useCurrentPuzzle } from "../features/puzzle/useCurrentPuzzle";

export function PuzzleRoute() {
  const puzzleQ = useCurrentPuzzle();
  const [getCurrentAttempts] = useLazyGetCurrentAttemptsQuery();

  useEffect(() => {
    if (puzzleQ.isSuccess) {
      getCurrentAttempts();
    }
  }, [getCurrentAttempts, puzzleQ]);

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
