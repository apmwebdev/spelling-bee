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

export function AnswersNumberStatus() {
  const { totalCount, knownCount } = useAppSelector(selectAnswerProgress);
  const showTotalWords = useAppSelector(selectProgressShowTotalWords);
  const numberClasses = useAppSelector(selectProgressStatusClasses);

  const text = () => {
    if (showTotalWords) return `${knownCount} / ${totalCount}`;
    return `${knownCount}`;

    // if (spoiledCount === 0) {
    //   if (showTotalWords) return `${foundCount}/${totalCount}`;
    //   return `${foundCount}`;
    // }
    // if (showTotalWords) return `${foundCount} + ${spoiledCount}/${totalCount}`;
    // return `${foundCount} + ${spoiledCount}`;
  };

  return (
    <div className="ProgressNumbers_item">
      <span className="ProgressNumbers_itemLabel">Words:</span>
      <span className={numberClasses}>{text()}</span>
    </div>
  );
}
