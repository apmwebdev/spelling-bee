/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { LetterHintPanel, LetterPanelData } from "@/features/letterPanel";
import { SearchHintPanel, SearchPanelData } from "@/features/searchPanel";
import {
  ObscurityHintPanel,
  ObscurityPanelData,
} from "@/features/obscurityPanel";
import {
  DefinitionHintPanel,
  DefinitionPanelData,
} from "@/features/definitionPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle";
import { HintContentBlur } from "@/features/hintPanels/components/shared/HintContentBlur";
import {
  HintPanelData,
  PanelTypes,
  selectPanelDisplayState,
} from "@/features/hintPanels";

export function HintPanelContentContainer({ panel }: { panel: HintPanelData }) {
  const answers = useAppSelector(selectAnswerWords);
  const displayState = useAppSelector(selectPanelDisplayState(panel.uuid));

  if (answers.length === 0) {
    return;
  }

  const panelTypeRouter = {
    [PanelTypes.Letter]: (
      <LetterHintPanel
        letterData={panel.typeData as LetterPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
    [PanelTypes.Search]: (
      <SearchHintPanel
        searchPanelData={panel.typeData as SearchPanelData}
        statusTracking={panel.statusTracking}
      />
    ),
    [PanelTypes.Obscurity]: (
      <ObscurityHintPanel
        obscurityPanelData={panel.typeData as ObscurityPanelData}
      />
    ),
    [PanelTypes.Definition]: (
      <DefinitionHintPanel
        definitionPanelData={panel.typeData as DefinitionPanelData}
      />
    ),
  };

  return (
    <div className="HintPanelContentContainer">
      <HintContentBlur isBlurred={displayState.isBlurred} />
      {panelTypeRouter[panel.typeData.panelType]}
    </div>
  );
}
