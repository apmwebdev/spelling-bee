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
import { selectRankProgress } from "@/features/progress/api/progressSlice";

export function NextRank() {
  const { nextRank, pointsUntilNextRank } = useAppSelector(selectRankProgress);

  if (!nextRank) return null;

  return (
    <div className="ProgressRankItem_container">
      <span className="ProgressRankItem_label">
        {pointsUntilNextRank} pt{pointsUntilNextRank === 1 ? "" : "s"} to:
      </span>
      <div className="ProgressRankItem">
        <span className="ProgressRankItem_name">{nextRank.baseRank.name}</span>
        <span className="ProgressRankItem_numbers">
          ({nextRank.baseRank.multiplier * 100}%, {nextRank.pointThreshold} pts)
        </span>
      </div>
    </div>
  );
}
