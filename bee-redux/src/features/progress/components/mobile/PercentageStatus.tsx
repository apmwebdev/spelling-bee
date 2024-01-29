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
  selectPercentageProgress,
  selectProgressStatusClasses,
} from "@/features/progress/api/progressSlice";
import { processPercentString } from "@/features/progress/util/progressUtil";

export function PercentageStatus() {
  const { pointsKnownPercent } = useAppSelector(selectPercentageProgress);
  const statusClasses = useAppSelector(selectProgressStatusClasses);

  return (
    <div className="ProgressStatus_item">
      <span className={statusClasses}>
        {processPercentString(pointsKnownPercent)}
      </span>
      <span>complete</span>
    </div>
  );
}
