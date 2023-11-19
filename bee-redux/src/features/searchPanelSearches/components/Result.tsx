/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { WordLengths } from "./WordLengths";
import { WordCount } from "./WordCount";
import { LettersPresent } from "./LettersPresent";
import { ResultHeader } from "./ResultHeader";
import { ResultKey } from "./ResultKey";
import { SearchResultProps } from "@/features/searchPanelSearches";
import { SubstringHintOutputKeys } from "@/features/hintPanels";

export function Result({ resultData, statusTracking }: SearchResultProps) {
  const content = () => {
    if (resultData.total.answers === 0) {
      return (
        <div>
          "{resultData.searchObject.searchString}" not found in answers with
          given settings
        </div>
      );
    }

    switch (resultData.searchObject.outputType) {
      case SubstringHintOutputKeys.WordLengthGrid:
        return (
          <WordLengths
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
      case SubstringHintOutputKeys.WordCountList:
        return (
          <WordCount resultData={resultData} statusTracking={statusTracking} />
        );
      case SubstringHintOutputKeys.LettersPresent:
        return (
          <LettersPresent
            resultData={resultData}
            statusTracking={statusTracking}
          />
        );
    }
  };

  return (
    <div className="SearchPanelResult">
      <ResultHeader searchObject={resultData.searchObject} />
      <ResultKey resultData={resultData} statusTracking={statusTracking} />
      <div className="SearchPanelResultContent">{content()}</div>
    </div>
  );
}
