/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { HintOutputTypeControl } from "@/features/hintPanels/components/settings/HintOutputTypeControl";
import { HintLocationControl } from "@/features/hintPanels/components/settings/HintLocationControl";
import { HintLettersOffsetControl } from "@/features/hintPanels/components/settings/HintLettersOffsetControl";
import { SearchPanelData, SearchPanelLocationKeys } from "..";
import { PanelTypes } from "@/features/hintPanels";
import { Uuid } from "@/types";

export function SearchPanelSettings({
  panelUuid,
  typeData,
}: {
  panelUuid: Uuid;
  typeData: SearchPanelData;
}) {
  const { outputType, location, lettersOffset } = typeData;
  return (
    <div className="SearchPanelSettings PanelSettings">
      <HintOutputTypeControl panelUuid={panelUuid} outputType={outputType} />
      <HintLocationControl
        panelUuid={panelUuid}
        location={location}
        panelType={PanelTypes.Search}
        style={{ gridRow: "2/3", gridColumn: "1/2" }}
      />
      <HintLettersOffsetControl
        panelUuid={panelUuid}
        lettersOffset={lettersOffset}
        disabled={location === SearchPanelLocationKeys.Anywhere}
        disabledTooltip="Can't use Offset with 'Location' set to 'Anywhere'"
        style={{ gridRow: "2/3", gridColumn: "2/3" }}
      />
    </div>
  );
}
