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
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintNumberOfLettersControl } from "./HintNumberOfLettersControl";
import { PanelCurrentDisplayState } from "@/features/hintPanels";
import { LetterPanelData } from "@/features/hintPanelType_letter";
import { Uuid } from "@/types";

export function LetterPanelQuickActions({
  panelUuid,
  displayState,
  typeData,
}: {
  panelUuid: Uuid;
  displayState: PanelCurrentDisplayState;
  typeData: LetterPanelData;
}) {
  return (
    <QuickActions panelUuid={panelUuid} displayState={displayState}>
      <HintHideKnownControl
        panelUuid={panelUuid}
        hideKnown={typeData.hideKnown}
      />
      <HintNumberOfLettersControl
        panelUuid={panelUuid}
        numberOfLetters={typeData.numberOfLetters}
      />
    </QuickActions>
  );
}
