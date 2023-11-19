/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { SearchResultProps } from "@/features/searchPanelSearches";
import { getSubstringHintStatusClasses } from "@/features/hintPanels";

export function LettersPresent({
  resultData,
  statusTracking,
}: SearchResultProps) {
  const present = resultData.total.answers > 0;
  return (
    <div className="SearchResultLettersList">
      <span>Result:</span>
      <div
        className={
          present
            ? getSubstringHintStatusClasses({
                baseClasses: "",
                cell: resultData.total,
                statusTracking,
              })
            : undefined
        }
      >
        {present ? "Present" : "Not present"}
      </div>
    </div>
  );
}
