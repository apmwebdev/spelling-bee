import { useAppSelector } from "@/app/hooks";
import { selectDate, selectIsLatest, selectPuzzleId } from "./puzzleSlice";
import { Icon } from "@iconify/react";
import { useLocation, useParams } from "react-router-dom";
import {
  dateRegex,
  getNextPuzzleDateString,
  getPreviousPuzzleDateString,
} from "@/utils";
import { ButtonLink } from "@/components/ButtonLink";

export function PuzzleNav() {
  const params = useParams();
  const puzzleDate = useAppSelector(selectDate);
  const puzzleId = useAppSelector(selectPuzzleId);
  const isLatest = useAppSelector(selectIsLatest);

  if (puzzleId === 0) {
    return null;
  }

  const firstPuzzleLink = () => {
    let urlString = "../puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += "20180509";
    } else {
      urlString += "1";
    }
    return (
      <ButtonLink
        to={urlString}
        className="puzzle-nav-link"
        disabled={puzzleId === 1}
      >
        <Icon icon="mdi:arrow-collapse-left" />
      </ButtonLink>
    );
  };

  const previousPuzzleLink = () => {
    let urlString = "../puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += getPreviousPuzzleDateString(params.identifier);
    } else {
      urlString += `${puzzleId - 1}`;
    }
    return (
      <ButtonLink
        to={urlString}
        className="puzzle-nav-link"
        disabled={puzzleId === 1}
      >
        <Icon icon="mdi:arrow-left" />
      </ButtonLink>
    );
  };

  const nextPuzzleLink = () => {
    let urlString = "../puzzles/";
    if (params.identifier?.match(dateRegex)) {
      urlString += getNextPuzzleDateString(params.identifier);
    } else {
      urlString += `${puzzleId + 1}`;
    }
    return (
      <ButtonLink
        to={urlString}
        className="puzzle-nav-link"
        disabled={isLatest}
      >
        <Icon icon="mdi:arrow-right" />
      </ButtonLink>
    );
  };

  const latestPuzzleLink = () => {
    return (
      <ButtonLink
        to="../puzzles/latest"
        className="puzzle-nav-link"
        disabled={isLatest}
      >
        <Icon icon="mdi:arrow-collapse-right" />
      </ButtonLink>
    );
  };

  return (
    <nav className="PuzzleNav">
      {firstPuzzleLink()}
      {previousPuzzleLink()}
      <span>
        Spelling Bee #{puzzleId}: {puzzleDate}
      </span>
      {nextPuzzleLink()}
      {latestPuzzleLink()}
    </nav>
  );
}
