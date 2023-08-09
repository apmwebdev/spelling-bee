import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { useParams } from "react-router-dom";
import { HintSection } from "../features/hints/HintSection";
import { useGetPuzzleQuery } from "../features/puzzle/puzzleApiSlice";

export function PuzzleRoute() {
  const params = useParams();
  useGetPuzzleQuery(params.identifier ? params.identifier : "latest", {
    refetchOnMountOrArgChange: true,
  });

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
