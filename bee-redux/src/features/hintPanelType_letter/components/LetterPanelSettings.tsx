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
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintLettersOffsetControl } from "@/features/hintPanels/components/settings/HintLettersOffsetControl";
import { HintNumberOfLettersControl } from "@/features/hintPanelType_letter/components/HintNumberOfLettersControl";
import { LetterPanelData } from "@/features/hintPanelType_letter";
import { PanelTypes } from "@/features/hintPanels";
import { Uuid } from "@/types";

export function LetterPanelSettings({
  panelUuid,
  typeData,
}: {
  panelUuid: Uuid;
  typeData: LetterPanelData;
}) {
  const { numberOfLetters, location, lettersOffset, outputType, hideKnown } =
    typeData;
  return (
    <div className="LetterPanelSettings PanelSettings">
      <HintOutputTypeControl panelUuid={panelUuid} outputType={outputType} />
      <HintNumberOfLettersControl
        panelUuid={panelUuid}
        numberOfLetters={typeData.numberOfLetters}
      />
      <HintLocationControl
        panelUuid={panelUuid}
        location={location}
        panelType={PanelTypes.Letter}
      />
      <HintLettersOffsetControl
        panelUuid={panelUuid}
        lettersOffset={lettersOffset}
        numberOfLetters={numberOfLetters}
      />
      <HintHideKnownControl panelUuid={panelUuid} hideKnown={hideKnown} />
    </div>
  );
}
