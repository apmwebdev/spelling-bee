import { useEffect } from "react";
import { useCurrentPuzzle } from "@/features/puzzle";
import { useLazyGetUserPuzzleDataQuery } from "@/features/userData";
import { Status } from "@/routes/puzzleRoutePageSections/Status";
import { Hints } from "@/routes/puzzleRoutePageSections/Hints";
import { Puzzle } from "@/routes/puzzleRoutePageSections/Puzzle";
import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";
import { PuzzleAndStatus } from "@/routes/puzzleRoutePageSections/PuzzleAndStatus";
import { SingleColumn } from "@/routes/puzzleRoutePageSections/SingleColumn";

export function PuzzleRoute() {
  const puzzleQ = useCurrentPuzzle();
  const [getUserPuzzleData] = useLazyGetUserPuzzleDataQuery();
  const columns = useColumnBreakpoints();

  useEffect(() => {
    if (puzzleQ.isSuccess) {
      getUserPuzzleData(puzzleQ.data.id);
    }
  }, [getUserPuzzleData, puzzleQ]);

  const content = (columns: number) => {
    if (columns === 3) {
      return (
        <>
          <Status />
          <Puzzle />
          <Hints />
        </>
      );
    } else if (columns === 2) {
      return (
        <>
          <PuzzleAndStatus />
          <Hints />
        </>
      );
    }
    return <SingleColumn />;
  };

  return (
    <div className="PuzzleMainContainer">
      <div className="PuzzleMain">{content(columns)}</div>
    </div>
  );
}
