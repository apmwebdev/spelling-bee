import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { useParams } from "react-router-dom";
import { fetchPuzzleAsync } from "../features/puzzle/puzzleSlice";
import { useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { HintSection } from "../features/hints/HintSection";
import { useGetPuzzleQuery } from "../features/api/apiSlice";

export function PuzzleRoute() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetPuzzleQuery("latest");

  // useEffect(() => {
  //   if (!params.identifier) {
  //     dispatch(fetchPuzzleAsync("latest"));
  //   } else {
  //     dispatch(fetchPuzzleAsync(params.identifier));
  //   }
  // }, [dispatch, params.identifier]);

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
