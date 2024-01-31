/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Results } from "@/features/searchPanel/components/Results";
import { StatusTrackingKeys } from "@/features/hintPanels/";
import { useAppSelector } from "@/app/hooks";
import { selectSpsByPanel } from "@/features/searchPanelSearches";
import { SearchPanelData } from "..";
import { SearchPanelForm } from "@/features/searchPanel/components/SearchPanelForm";
import { HorizontalScrollContainer } from "@/components/HorizontalScrollContainer";

export function SearchHintPanel({
  searchPanelData,
  statusTracking,
}: {
  searchPanelData: SearchPanelData;
  statusTracking: StatusTrackingKeys;
}) {
  const panelSearches = useAppSelector(selectSpsByPanel(searchPanelData.uuid));

  return (
    <div className="SearchHintPanel">
      <SearchPanelForm searchPanelData={searchPanelData} />
      <HorizontalScrollContainer>
        <Results searches={panelSearches} tracking={statusTracking} />
      </HorizontalScrollContainer>
    </div>
  );
}
