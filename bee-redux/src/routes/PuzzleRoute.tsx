import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { useParams } from "react-router-dom";
import { HintSection } from "../features/hints/HintSection";
import { useGetPuzzleQuery } from "../features/puzzle/puzzleApiSlice";
import { useLazyGetCurrentAttemptsQuery } from "../features/guesses/guessesApiSlice";
import { useEffect } from "react";

export function PuzzleRoute() {
  const params = useParams();
  const puzzleQ = useGetPuzzleQuery(
    params.identifier ? params.identifier : "latest",
    { refetchOnMountOrArgChange: true },
  );
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
        <HintSection />
      </div>
    </div>
  );
}
