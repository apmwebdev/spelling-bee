/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintRevealedLettersControl } from "@/features/hintPanels/components/settings/HintRevealedLettersControl";
import { HintRevealLengthControl } from "@/features/hintPanels/components/settings/HintRevealLengthControl";
import { HintSortOrderControl } from "@/features/hintPanels/components/settings/HintSortOrderControl";
import { HintSeparateKnownControl } from "@/features/hintPanels/components/settings/HintSeparateKnownControl";
import { HintShowObscurityControl } from "@/features/hintPanelType_definition/components/HintShowObscurityControl";
import { DefinitionPanelData } from "../";

export function DefinitionPanelSettings({
  panelUuid,
  typeData,
}: {
  panelUuid: string;
  typeData: DefinitionPanelData;
}) {
  return (
    <div className="DefinitionPanelSettings PanelSettings">
      <HintHideKnownControl
        panelUuid={panelUuid}
        hideKnown={typeData.hideKnown}
      />
      <HintRevealedLettersControl
        panelUuid={panelUuid}
        revealedLetters={typeData.revealedLetters}
      />
      <HintSeparateKnownControl
        panelUuid={panelUuid}
        separateKnown={typeData.separateKnown}
        disabled={typeData.hideKnown}
      />
      <HintShowObscurityControl
        panelUuid={panelUuid}
        showObscurity={typeData.showObscurity}
      />
      <HintRevealLengthControl
        panelUuid={panelUuid}
        revealLength={typeData.revealLength}
      />
      <HintSortOrderControl
        panelUuid={panelUuid}
        sortOrder={typeData.sortOrder}
      />
    </div>
  );
}
