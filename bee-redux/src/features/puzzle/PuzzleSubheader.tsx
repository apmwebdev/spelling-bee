import { useAppSelector } from "../../app/hooks";
import { selectDate, selectIsLatest, selectPuzzleId } from "./puzzleSlice";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import {
  dateRegex,
  getNextPuzzleDateString,
  getPreviousPuzzleDateString,
} from "../../utils/utils";

export function PuzzleSubheader() {
  const params = useParams();
  const puzzleDate = useAppSelector(selectDate);
  const puzzleId = useAppSelector(selectPuzzleId);
  const isLatest = useAppSelector(selectIsLatest);

  if (puzzleId === 0) {
    return null;
  }

  const firstPuzzleLink = () => {
    if (puzzleId === 1) {
      return (
        <div className="puzzle-nav-link disabled">
          <Icon icon="mdi:arrow-collapse-left" />
          {/*<span>First</span>*/}
        </div>
      );
    }
    let urlString = "puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += "20180509";
    } else {
      urlString += "1";
    }
    return (
      <Link className="puzzle-nav-link" to={urlString}>
        <Icon icon="mdi:arrow-collapse-left" />
        {/*<span>First</span>*/}
      </Link>
    );
  };

  const previousPuzzleLink = () => {
    if (puzzleId === 1) {
      return (
        <div className="puzzle-nav-link disabled">
          <Icon icon="mdi:arrow-left" />
          {/*<span>Prev</span>*/}
        </div>
      );
    }
    let urlString = "puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += getPreviousPuzzleDateString(params.identifier);
    } else {
      urlString += `${puzzleId - 1}`;
    }
    return (
      <Link className="puzzle-nav-link" to={urlString}>
        <Icon icon="mdi:arrow-left" />
        {/*<span>Prev</span>*/}
      </Link>
    );
  };

  const nextPuzzleLink = () => {
    if (isLatest) {
      return (
        <div className="puzzle-nav-link disabled">
          {/*<span>Next</span>*/}
          <Icon icon="mdi:arrow-right" />
        </div>
      );
    }
    let urlString = "puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += getNextPuzzleDateString(params.identifier);
    } else {
      urlString += `${puzzleId + 1}`;
    }
    return (
      <Link className="puzzle-nav-link" to={urlString}>
        {/*<span>Next</span>*/}
        <Icon icon="mdi:arrow-right" />
      </Link>
    );
  };

  const latestPuzzleLink = () => {
    if (isLatest) {
      return (
        <div className="puzzle-nav-link disabled">
          {/*<span>Latest</span>*/}
          <Icon icon="mdi:arrow-collapse-right" />
        </div>
      );
    }
    return (
      <Link className="puzzle-nav-link" to="puzzles/latest">
        {/*<span>Latest</span>*/}
        <Icon icon="mdi:arrow-collapse-right" />
      </Link>
    );
  };

  return (
    <>
      {firstPuzzleLink()}
      {previousPuzzleLink()}
      <span>
        Spelling Bee #{puzzleId}: {puzzleDate}
      </span>
      {nextPuzzleLink()}
      {latestPuzzleLink()}
    </>
  );
}
