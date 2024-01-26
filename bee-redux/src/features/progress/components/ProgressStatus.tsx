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
  selectProgressData,
  selectProgressSettings,
} from "@/features/progress/api/progressSlice";
import { trackingStatusClasses } from "@/util";

export function ProgressStatus() {
  const { showTotalWords, showTotalPoints } = useAppSelector(
    selectProgressSettings,
  );
  const { answerData, scoreData, percentageData, rankData } =
    useAppSelector(selectProgressData);
  const statusClasses = trackingStatusClasses({
    baseClass: "ProgressStatusCount",
    currentCount: answerData.knownCount,
    totalCount: answerData.totalCount,
  });

  const wordsTrackingText = () => {
    let text = `${answerData.knownCount}`;
    if (showTotalWords) {
      text += `/${answerData.totalCount}`;
    }
    return (
      <div className="words ProgressStatus_item">
        <span className={statusClasses}>{text}</span>
        <span>words</span>
      </div>
    );
  };

  const pointsTrackingText = () => {
    let pointsText = `${scoreData.current}`;
    if (showTotalPoints) {
      pointsText += `/${scoreData.total}`;
    }
    return (
      <div className="points ProgressStatus_item">
        <span className={statusClasses}>{pointsText}</span>
        <span>points</span>
      </div>
    );
  };

  const percentComplete = () => {
    const val = percentageData.pointsFound;
    if (Number.isNaN(val)) return "0";

    const formattedVal = val.toFixed(2);
    if (formattedVal.slice(-2) === "00") return formattedVal.slice(0, -3);

    return formattedVal;
  };

  const percentageTrackingText = () => {
    const percentageCompleteText = `${percentComplete()}%`;
    return (
      <div className="ProgressStatus_item">
        <span className={statusClasses}>{percentageCompleteText}</span>
        <span>complete</span>
      </div>
    );
  };

  const rankTrackingText = () => {
    if (!rankData.nextRank) return null;
    return (
      <div className="ProgressStatus_item ProgressStatus_rankTracking">
        <span>
          {rankData.pointsUntilNextRank} pt
          {rankData.pointsUntilNextRank === 1 ? "" : "s"} to next rank:
        </span>
        <span>
          {rankData.nextRank.baseRank.name} (
          {rankData.nextRank.baseRank.multiplier * 100}%)
        </span>
      </div>
    );
  };

  return (
    <div className="ProgressStatus">
      {wordsTrackingText()}
      {pointsTrackingText()}
      {percentageTrackingText()}
      {rankTrackingText()}
    </div>
  );
}
