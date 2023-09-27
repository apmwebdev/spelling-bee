import uniqid from "uniqid";
import { PanelStatusTrackingControl } from "./PanelStatusTrackingControl";
import { PanelNameInputForm } from "./PanelNameInputForm";
import { PanelInitialDisplayControls } from "./PanelInitialDisplayControls";
import {
  isLetterPanelData,
  LetterPanelSettings,
} from "@/features/hintPanelType_letter";
import {
  isSearchPanelData,
  SearchPanelSettings,
} from "@/features/hintPanelType_search";
import { ObscurityPanelSettings } from "@/features/hintPanelType_obscurity";
import { DefinitionPanelSettings } from "@/features/hintPanelType_definition";
import { HintPanelData } from "@/features/hintPanels/types";
import { isObscurityPanelData } from "@/features/hintPanelType_obscurity/types";
import { isDefinitionPanelData } from "@/features/hintPanelType_definition/types";

export function HintPanelSettings({ panel }: { panel: HintPanelData }) {
  const typeSpecificSettings = () => {
    if (isLetterPanelData(panel.typeData)) {
      return (
        <LetterPanelSettings panelId={panel.id} typeData={panel.typeData} />
      );
    }
    if (isSearchPanelData(panel.typeData)) {
      return (
        <SearchPanelSettings panelId={panel.id} typeData={panel.typeData} />
      );
    }
    if (isObscurityPanelData(panel.typeData)) {
      return (
        <ObscurityPanelSettings panelId={panel.id} typeData={panel.typeData} />
      );
    }
    if (isDefinitionPanelData(panel.typeData)) {
      return (
        <DefinitionPanelSettings panelId={panel.id} typeData={panel.typeData} />
      );
    }
  };

  return (
    <div className="HintPanelSettings">
      <div className="HintPanelSettingsHeader">Settings</div>
      {typeSpecificSettings()}
      <div className="GeneralPanelSettings">
        <PanelStatusTrackingControl
          panelId={panel.id}
          statusTracking={panel.statusTracking}
        />
        <PanelNameInputForm
          panelId={panel.id}
          currentName={panel.name}
          inputId={`PanelNameInput${uniqid()}`}
        />
        <PanelInitialDisplayControls
          panelId={panel.id}
          initialDisplayState={panel.initialDisplayState}
        />
      </div>
    </div>
  );
}
