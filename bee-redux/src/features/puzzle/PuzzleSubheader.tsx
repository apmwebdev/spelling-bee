import { useAppSelector } from "../../app/hooks";
import { selectDate, selectPuzzleId } from "./puzzleSlice";
import { Icon } from "@iconify/react";
import { Link, useParams } from "react-router-dom";
import {
  dateRegex,
  getDateFromString,
  getDateString,
  getNextPuzzleDateString,
  getPreviousPuzzleDateString,
} from "../../utils/utils";

export function PuzzleSubheader() {
  const params = useParams();
  const puzzleDate = useAppSelector(selectDate);
  const puzzleId = useAppSelector(selectPuzzleId);

  if (puzzleId === 0) {
    return null;
  }

  const previousPuzzleLink = () => {
    if (puzzleId === 1) {
      return (
        <div className="puzzle-nav-link disabled">
          <Icon icon="mdi:arrow-left" />
          <span>Prev</span>
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
        <span>Prev</span>
      </Link>
    );
  };

  const nextPuzzleLink = () => {
    const puzzleDateObj = getDateFromString(puzzleDate);
    const currentDate = new Date(Date.now());
    // Add offset for when the NYTimes publishes new puzzles
    currentDate.setHours(currentDate.getHours() - 8);
    if (getDateString(puzzleDateObj) === getDateString(currentDate)) {
      return (
        <div className="puzzle-nav-link disabled">
          <span>Next</span>
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
        <span>Next</span>
        <Icon icon="mdi:arrow-right" />
      </Link>
    );
  };

  return (
    <>
      {previousPuzzleLink()}
      <span>
        Spelling Bee #{puzzleId}: {puzzleDate}
      </span>
      {nextPuzzleLink()}
    </>
  );
}