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
import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { PanelCurrentDisplayState } from "@/features/hintPanels";
import { ObscurityPanelData } from "@/features/obscurityPanel";
import { DefinitionPanelData } from "@/features/definitionPanel";

import { Uuid } from "@/features/api";

export function WordInfoQuickActions({
  panelUuid,
  displayState,
  typeData,
}: {
  panelUuid: Uuid;
  displayState: PanelCurrentDisplayState;
  typeData: ObscurityPanelData | DefinitionPanelData;
}) {
  return (
    <QuickActions panelUuid={panelUuid} displayState={displayState}>
      <HintHideKnownControl
        panelUuid={panelUuid}
        hideKnown={typeData.hideKnown}
      />
      <HintRevealedLettersControl
        panelUuid={panelUuid}
        revealedLetters={typeData.revealedLetters}
      />
    </QuickActions>
  );
}
