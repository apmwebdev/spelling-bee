import { useAppSelector } from "@/app/hooks";
import { selectDate, selectIsLatest, selectPuzzleId } from "./puzzleSlice";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  dateRegex,
  getNextPuzzleDateString,
  getPreviousPuzzleDateString,
} from "@/utils";
import { ChangeEvent, FormEvent, useState } from "react";
import { AttemptControls } from "../guesses/AttemptControls";
import { ButtonLink } from "@/components/ButtonLink";

export function PuzzleSubheader() {
  const params = useParams();
  const puzzleDate = useAppSelector(selectDate);
  const puzzleId = useAppSelector(selectPuzzleId);
  const isLatest = useAppSelector(selectIsLatest);
  const navigate = useNavigate();
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("");

  if (puzzleId === 0) {
    return null;
  }

  const firstPuzzleLink = () => {
    let urlString = "puzzles/";
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
    let urlString = "puzzles/";
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
    let urlString = "puzzles/";
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
        to="puzzles/latest"
        className="puzzle-nav-link"
        disabled={isLatest}
      >
        <Icon icon="mdi:arrow-collapse-right" />
      </ButtonLink>
    );
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return navigate(`/puzzle/${puzzleIdentifier}`);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
      setPuzzleIdentifier(e.target.value);
    }
  };

  return (
    <>
      <AttemptControls />
      <nav className="sb-puzzle-nav">
        {firstPuzzleLink()}
        {previousPuzzleLink()}
        <span>
          Spelling Bee #{puzzleId}: {puzzleDate}
        </span>
        {nextPuzzleLink()}
        {latestPuzzleLink()}
      </nav>
      <form className="sb-puzzle-search" onSubmit={handleSearch}>
        <Icon icon="mdi:search" />
        <input
          type="text"
          name="identifierInput"
          value={puzzleIdentifier}
          placeholder="Date, ID, or letters"
          onChange={(e) => handleSearchInput(e)}
        />
      </form>
    </>
  );
}
