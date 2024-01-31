/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { isLetterPanel, LetterHintPanel } from "@/features/letterPanel";
import { isSearchPanel, SearchHintPanel } from "@/features/searchPanel";
import {
  isObscurityPanel,
  ObscurityHintPanel,
} from "@/features/obscurityPanel";
import {
  DefinitionHintPanel,
  isDefinitionPanel,
} from "@/features/definitionPanel";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerWords } from "@/features/puzzle";
import { HintContentBlur } from "@/features/hintPanels/components/shared/HintContentBlur";
import { selectPanelDisplayState, THintPanel } from "@/features/hintPanels";

export function HintPanelContentMain({ panel }: { panel: THintPanel }) {
  const answers = useAppSelector(selectAnswerWords);
  const displayState = useAppSelector(selectPanelDisplayState(panel.uuid));

  if (answers.length === 0) {
    return;
  }

  const content = () => {
    if (isLetterPanel(panel)) {
      return (
        <LetterHintPanel
          letterData={panel.typeData}
          statusTracking={panel.statusTracking}
        />
      );
    }

    if (isSearchPanel(panel)) {
      return (
        <SearchHintPanel
          searchPanelData={panel.typeData}
          statusTracking={panel.statusTracking}
        />
      );
    }

    if (isObscurityPanel(panel)) {
      return <ObscurityHintPanel obscurityPanelData={panel.typeData} />;
    }

    if (isDefinitionPanel(panel)) {
      return <DefinitionHintPanel definitionPanelData={panel.typeData} />;
    }

    return "Invalid hint panel data";
  };

  return (
    <div className="HintPanelContentMain">
      <HintContentBlur isBlurred={displayState.isBlurred} />
      {content()}
    </div>
  );
}
