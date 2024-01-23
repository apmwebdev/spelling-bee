/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import uniqid from "uniqid";
import { PanelStatusTrackingControl } from "./PanelStatusTrackingControl";
import { PanelNameInputForm } from "./PanelNameInputForm";
import { PanelInitialDisplayControls } from "./PanelInitialDisplayControls";
import { isLetterPanelData, LetterPanelSettings } from "@/features/letterPanel";
import { isSearchPanelData, SearchPanelSettings } from "@/features/searchPanel";
import { ObscurityPanelSettings } from "@/features/obscurityPanel";
import { DefinitionPanelSettings } from "@/features/definitionPanel";
import { HintPanelData } from "@/features/hintPanels/types/hintPanelTypes";
import { isObscurityPanelData } from "@/features/obscurityPanel/types/obscurityPanelTypes";
import { isDefinitionPanelData } from "@/features/definitionPanel/types/definitionPanelTypes";

export function HintPanelSettings({ panel }: { panel: HintPanelData }) {
  const typeSpecificSettings = () => {
    if (isLetterPanelData(panel.typeData)) {
      return (
        <LetterPanelSettings panelUuid={panel.uuid} typeData={panel.typeData} />
      );
    }
    if (isSearchPanelData(panel.typeData)) {
      return (
        <SearchPanelSettings panelUuid={panel.uuid} typeData={panel.typeData} />
      );
    }
    if (isObscurityPanelData(panel.typeData)) {
      return (
        <ObscurityPanelSettings
          panelUuid={panel.uuid}
          typeData={panel.typeData}
        />
      );
    }
    if (isDefinitionPanelData(panel.typeData)) {
      return (
        <DefinitionPanelSettings
          panelUuid={panel.uuid}
          typeData={panel.typeData}
        />
      );
    }
  };

  return (
    <div className="HintPanelSettings SettingsCollapsible">
      <div className="HintPanelSettingsHeader">Settings</div>
      {typeSpecificSettings()}
      <div className="GeneralPanelSettings">
        <PanelStatusTrackingControl
          panelUuid={panel.uuid}
          statusTracking={panel.statusTracking}
        />
        <PanelNameInputForm
          panelUuid={panel.uuid}
          currentName={panel.name}
          inputId={`PanelNameInput${uniqid()}`}
        />
        <PanelInitialDisplayControls
          panelUuid={panel.uuid}
          initialDisplayState={panel.initialDisplayState}
        />
      </div>
    </div>
  );
}
