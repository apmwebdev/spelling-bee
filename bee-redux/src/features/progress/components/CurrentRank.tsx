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
import { selectCurrentOrBlankRank } from "@/features/progress/api/progressSlice";

export function CurrentRank() {
  const currentRank = useAppSelector(selectCurrentOrBlankRank);

  return (
    <div className="ProgressRankItem_container">
      <span className="ProgressRankItem_label">
        Rank: {currentRank.baseRank.level} / 10
      </span>
      <div className="ProgressRankItem">
        <span className="ProgressRankItem_name">
          {currentRank.baseRank.name ?? "No puzzle"}
        </span>
        <span className="ProgressRankItem_numbers">
          ({currentRank.baseRank.multiplier * 100}%,{" "}
          {currentRank.pointThreshold} pts)
        </span>
      </div>
    </div>
  );
}
