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
  StatusTrackingOptions,
  SubstringHintOutputOptions,
} from "@/features/hintPanels";
import { SearchResultProps } from "@/features/searchPanelSearches";
import { SearchPanelLocationOptions } from "@/features/hintPanelType_search";

export function ResultKey({ resultData, statusTracking }: SearchResultProps) {
  const { searchObject } = resultData;
  const { location, lettersOffset, outputType } = searchObject;

  const content = () => {
    return (
      <div className="SearchPanelResultKeyContainer">
        <div className="SearchPanelResultKey">
          <div className="SearchPanelResultKeyItem">
            <header>Location</header>
            <div>{SearchPanelLocationOptions[location].title}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Offset</header>
            <div>{lettersOffset}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Display</header>
            <div>{StatusTrackingOptions[statusTracking].compactTitle}</div>
          </div>
          <div className="SearchPanelResultKeyItem">
            <header>Output</header>
            <div>{SubstringHintOutputOptions[outputType].title}</div>
          </div>
        </div>
      </div>
    );
  };

  return content();
}
