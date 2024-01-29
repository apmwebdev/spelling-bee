/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import classNames from "classnames/dedupe";
import { AnswerProgress } from "@/features/progress/types/progressTypes";

export function KnownWordsStatusItem({
  label,
  wordData,
  showTotal,
  hide,
}: {
  label: string;
  wordData: AnswerProgress;
  showTotal: boolean;
  hide?: boolean;
}) {
  if (hide) return;

  const { totalCount, foundCount, spoiledCount } = wordData;
  const foundCountClasses = classNames("KWSI_count", {
    ErrorText: totalCount > 0 && foundCount === 0,
    SuccessText: totalCount > 0 && foundCount === totalCount,
    WarningText: totalCount > 0 && foundCount > 0 && foundCount < totalCount,
  });
  const spoiledCountClasses = classNames("KWSI_count", {
    SuccessText: totalCount > 0 && spoiledCount === 0,
    WarningText: totalCount > 0 && spoiledCount > 0,
  });

  const foundText = () => {
    if (totalCount === 0) return 0;
    if (showTotal) return `${foundCount}/${totalCount}`;
    return foundCount;
  };

  const spoiledContent = () => {
    if (totalCount === 0) return <span>-</span>;
    if (spoiledCount === 0) {
      return (
        <>
          <span className={spoiledCountClasses}>0</span> spoiled
        </>
      );
    }
    return (
      <>
        + <span className={spoiledCountClasses}>{spoiledCount}</span> spoiled
      </>
    );
  };

  return (
    <div className="KnownWordsStatusItem">
      <div className="KWSI_found">
        <span className={foundCountClasses}>{foundText()}</span>
        <span className="KWSI_foundLabel">{label}</span>
      </div>
      <div className="KWSI_spoiled">{spoiledContent()}</div>
    </div>
  );
}
