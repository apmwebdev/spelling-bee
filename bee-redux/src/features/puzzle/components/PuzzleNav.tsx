/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppSelector } from "@/app/hooks";
import { selectDate, selectIsLatest, selectPuzzleId } from "@/features/puzzle";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import {
  dateRegex,
  getNextPuzzleDateString,
  getPreviousPuzzleDateString,
} from "@/util";
import { ButtonLink } from "@/components/ButtonLink";
import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";

export function PuzzleNav() {
  const params = useParams();
  const columns = useColumnBreakpoints();
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
      <h1 className="PuzzleNav_title">
        {columns === 1
          ? `${puzzleDate}`
          : `Spelling Bee ${puzzleId}: ${puzzleDate}`}
      </h1>
      {nextPuzzleLink()}
      {latestPuzzleLink()}
    </nav>
  );
}
