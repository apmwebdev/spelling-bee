/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { HintLocationControl } from "@/features/hintPanels/components/settings/HintLocationControl";
import { HintLettersOffsetControl } from "@/features/hintPanels/components/settings/HintLettersOffsetControl";
import { PanelCurrentDisplayState, PanelTypes } from "@/features/hintPanels";
import { SearchPanelData, SearchPanelLocationKeys } from "..";
import { Uuid } from "@/types";

export function SearchPanelQuickActions({
  panelUuid,
  displayState,
  typeData,
}: {
  panelUuid: Uuid;
  displayState: PanelCurrentDisplayState;
  typeData: SearchPanelData;
}) {
  return (
    <QuickActions panelUuid={panelUuid} displayState={displayState}>
      <HintLocationControl
        panelUuid={panelUuid}
        location={typeData.location}
        panelType={PanelTypes.Search}
      />
      <HintLettersOffsetControl
        panelUuid={panelUuid}
        lettersOffset={typeData.lettersOffset}
        disabled={typeData.location === SearchPanelLocationKeys.Anywhere}
        disabledTooltip="Can't use Offset with 'Location' set to 'Anywhere'"
      />
    </QuickActions>
  );
}
