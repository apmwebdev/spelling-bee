/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import uniqid from "uniqid";
import { Rank, RanksType } from "@/features/puzzle";

export function ProgressBar({
  ranks,
  currentRank,
}: {
  ranks: RanksType | [Rank];
  currentRank: Rank;
}) {
  return (
    <div className="ProgressBar">
      {ranks.map((rank) => {
        return (
          <div
            key={uniqid()}
            className={`RankTic${rank === currentRank ? " active" : ""}`}
          ></div>
        );
      })}
    </div>
  );
}
