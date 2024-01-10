/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useEffect } from "react";
import { useCurrentPuzzle } from "@/features/puzzle";
import { Status } from "@/routes/puzzleRoutePageSections/Status";
import { Hints } from "@/routes/puzzleRoutePageSections/Hints";
import { Puzzle } from "@/routes/puzzleRoutePageSections/Puzzle";
import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";
import { PuzzleAndStatus } from "@/routes/puzzleRoutePageSections/PuzzleAndStatus";
import { SingleColumn } from "@/routes/puzzleRoutePageSections/SingleColumn";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getUserPuzzleDataThunk } from "@/features/userData/api/userDataLoader";
import { selectUser } from "@/features/auth";

export function PuzzleRoute() {
  const dispatch = useAppDispatch();
  const puzzleQ = useCurrentPuzzle();
  const user = useAppSelector(selectUser);
  // const [getUserPuzzleData] = useLazyGetUserPuzzleDataQuery();
  const columns = useColumnBreakpoints();

  useEffect(() => {
    if (puzzleQ.isSuccess) {
      const currentPuzzleId = puzzleQ.data.id;
      dispatch(getUserPuzzleDataThunk(currentPuzzleId));
    }
  }, [puzzleQ, user]);

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
