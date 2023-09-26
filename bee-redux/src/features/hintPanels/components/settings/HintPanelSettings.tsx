import uniqid from "uniqid";
import {
  isDefinitionPanelData,
  isLetterPanelData,
  isObscurityPanelData,
  isSearchPanelData,
} from "@/features/hints";
import { PanelStatusTrackingControl } from "./PanelStatusTrackingControl";
import { PanelNameInputForm } from "./PanelNameInputForm";
import { PanelInitialDisplayControls } from "./PanelInitialDisplayControls";
import { LetterPanelSettings } from "@/features/hints/components/letterPanel/LetterPanelSettings";
import { SearchPanelSettings } from "@/features/hints/components/searchPanel/SearchPanelSettings";
import { ObscurityPanelSettings } from "@/features/hints/components/obscurityPanel/ObscurityPanelSettings";
import { DefinitionPanelSettings } from "@/features/hints/components/definitionPanel/DefinitionPanelSettings";
import { HintPanelData } from "@/features/hintPanels/types";

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
