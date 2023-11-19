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
import { HintSeparateKnownControl } from "@/features/hintPanels/components/settings/HintSeparateKnownControl";
import { HintRevealedLettersControl } from "@/features/hintPanels/components/settings/HintRevealedLettersControl";
import { HintSortOrderControl } from "@/features/hintPanels/components/settings/HintSortOrderControl";
import { HintRevealLengthControl } from "@/features/hintPanels/components/settings/HintRevealLengthControl";
import { HintClickToDefineControl } from "@/features/hintPanelType_obscurity/components/HintClickToDefineControl";
import { ObscurityPanelData } from "..";

export function ObscurityPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: ObscurityPanelData;
}) {
  return (
    <div className="ObscurityPanelSettings PanelSettings">
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
      <HintSeparateKnownControl
        panelId={panelId}
        separateKnown={typeData.separateKnown}
        disabled={typeData.hideKnown}
      />
      <HintClickToDefineControl
        panelId={panelId}
        clickToDefine={typeData.clickToDefine}
      />
      <HintRevealLengthControl
        panelId={panelId}
        revealLength={typeData.revealLength}
      />
      <HintSortOrderControl panelId={panelId} sortOrder={typeData.sortOrder} />
    </div>
  );
}
