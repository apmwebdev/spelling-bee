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
import {
  selectProgressStatusClasses,
  selectRankProgress,
} from "@/features/progress/api/progressSlice";

export function RankStatus() {
  const { nextRank, pointsUntilNextRank } = useAppSelector(selectRankProgress);
  const statusClasses = useAppSelector(selectProgressStatusClasses);

  if (!nextRank) return null;

  return (
    <div className="ProgressStatus_item ProgressStatus_rankTracking">
      <span>
        <span className={statusClasses}>{pointsUntilNextRank}</span> pt
        {pointsUntilNextRank === 1 ? "" : "s"} to:
      </span>
      <span>
        {nextRank.baseRank.name} ({nextRank.baseRank.multiplier * 100}%)
      </span>
    </div>
  );
}
