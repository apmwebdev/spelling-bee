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

export function PercentageStatus() {
  const { pointsFoundPercent, pointsSpoiledPercent } = useAppSelector(
    selectPercentageProgress,
  );
  const statusClasses = useAppSelector(selectProgressStatusClasses);

  const processPercentString = (val: number) => {
    const formatPercentString = (val: number) => {
      if (Number.isNaN(val)) return "0";
      const formattedVal = val.toFixed(2);
      if (formattedVal.slice(-2) === "00") return formattedVal.slice(0, -3);
      return formattedVal;
    };

    return formatPercentString(val) + "%";
  };

  const text = () => {
    if (
      Number.isNaN(pointsFoundPercent) ||
      Number.isNaN(pointsSpoiledPercent) ||
      pointsSpoiledPercent === 0
    ) {
      return processPercentString(pointsFoundPercent);
    }

    return `${processPercentString(
      pointsFoundPercent,
    )} + ${processPercentString(pointsSpoiledPercent)}`;
  };

  return (
    <div className="ProgressStatus_item">
      <span className={statusClasses}>{text()}</span>
      <span>complete</span>
    </div>
  );
}
