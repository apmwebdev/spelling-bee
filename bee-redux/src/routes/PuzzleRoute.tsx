import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { HintSection } from "../features/hints/HintSection";
import { useLazyGetCurrentAttemptsQuery } from "../features/guesses/guessesApiSlice";
import { useEffect } from "react";
import { useCurrentPuzzle } from "../features/puzzle/useCurrentPuzzle";

export function PuzzleRoute() {
  const puzzle = useCurrentPuzzle();
  const [getCurrentAttempts] = useLazyGetCurrentAttemptsQuery();

  useEffect(() => {
    if (puzzle.status.isSuccess) {
      getCurrentAttempts();
    }
  }, [getCurrentAttempts, puzzle]);

  return (
    <div className="sb-main-container">
      <div className="sb-main">
        <Status />
        <Puzzle />
        <HintSection />
      </div>
    </div>
  );
}
