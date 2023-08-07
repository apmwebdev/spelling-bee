import { Puzzle } from "../features/puzzle/Puzzle";
import { Status } from "../features/status/Status";
import { useParams } from "react-router-dom";
import { fetchPuzzleAsync, selectAnswers } from "../features/puzzle/puzzleSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useContext, useEffect } from "react";
import { HintSection } from "../features/hints/HintSection";
import { SubheaderContext } from "../app/SubheaderProvider";
import { PuzzleSubheader } from "../features/puzzle/PuzzleSubheader";

export function PuzzleRoute() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { setSubheader } = useContext(SubheaderContext);

  useEffect(() => {
    if (!params.identifier) {
      dispatch(fetchPuzzleAsync("latest"));
    } else {
      dispatch(fetchPuzzleAsync(params.identifier));
    }
    setSubheader(<PuzzleSubheader />);
  }, [dispatch, params.identifier, setSubheader]);

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
