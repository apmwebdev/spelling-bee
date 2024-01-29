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
  selectAnswerProgress,
  selectProgressShowTotalWords,
  selectProgressStatusClasses,
} from "@/features/progress/api/progressSlice";

export function AnswersStatus() {
  const { totalCount, knownCount } = useAppSelector(selectAnswerProgress);
  const showTotalWords = useAppSelector(selectProgressShowTotalWords);
  const statusClasses = useAppSelector(selectProgressStatusClasses);

  const text = () => {
    if (showTotalWords) return `${knownCount}/${totalCount}`;
    return `${knownCount}`;
  };

  return (
    <div className="ProgressStatus_item">
      <span className={statusClasses}>{text()}</span>
      <span>words</span>
    </div>
  );
}
