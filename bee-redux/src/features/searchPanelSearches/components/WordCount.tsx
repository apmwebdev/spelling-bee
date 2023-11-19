/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  getSubstringHintStatusClasses,
  StatusTrackingOptions,
} from "@/features/hintPanels";
import { SearchResultProps } from "@/features/searchPanelSearches";

export function WordCount({ resultData, statusTracking }: SearchResultProps) {
  return (
    <div className="SearchResultWordCount">
      <span>Result:</span>
      <div
        className={getSubstringHintStatusClasses({
          baseClasses: "SearchHintResult_WC_Result",
          cell: resultData.total,
          statusTracking,
        })}
      >
        {StatusTrackingOptions[statusTracking].outputFn(resultData.total)}
      </div>
    </div>
  );
}
