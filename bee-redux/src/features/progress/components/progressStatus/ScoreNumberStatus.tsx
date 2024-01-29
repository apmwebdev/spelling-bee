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
  selectProgressShowTotalPoints,
  selectProgressStatusClasses,
  selectScoreProgress,
} from "@/features/progress/api/progressSlice";

export function ScoreNumberStatus() {
  const { score, totalPoints } = useAppSelector(selectScoreProgress);
  const showTotalPoints = useAppSelector(selectProgressShowTotalPoints);
  const numberClasses = useAppSelector(selectProgressStatusClasses);

  const text = () => {
    if (showTotalPoints) return `${score} / ${totalPoints}`;
    return `${score}`;

    // if (spoiledPoints === 0) {
    //   if (showTotalPoints) return `${score}/${totalPoints}`;
    //   return `${score}`;
    // }
    // if (showTotalPoints) return `${score} + ${spoiledPoints}/${totalPoints}`;
    // return `${score} + ${spoiledPoints}`;
  };

  return (
    <div className="ProgressNumbers_item">
      <span className="ProgressNumbers_itemLabel">Points:</span>
      <span className={numberClasses}>{text()}</span>
    </div>
  );
}
