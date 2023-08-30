import uniqid from "uniqid";
import {
  HintPanelData,
  isDefinitionPanelData,
  isLetterPanelData,
  isObscurityPanelData,
  isSearchPanelData,
} from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { PanelStatusTrackingControl } from "@/features/hints/components/settings/PanelStatusTrackingControl";
import { PanelNameInputForm } from "@/features/hints/components/settings/PanelNameInputForm";
import { PanelInitialDisplayControls } from "@/features/hints/components/settings/PanelInitialDisplayControls";
import { LetterPanelSettings } from "@/features/hints/components/panels/letter/LetterPanelSettings";
import { SearchPanelSettings } from "@/features/hints/components/panels/search/SearchPanelSettings";
import { ObscurityPanelSettings } from "@/features/hints/components/panels/obscurity/ObscurityPanelSettings";
import { DefinitionPanelSettings } from "@/features/hints/components/panels/definition/DefinitionPanelSettings";

export function HintPanelSettings({ panel }: { panel: HintPanelData }) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const toggleExpanded = () => {
    updatePanel({
      id: panel.id,
      debounceField: "currentIsSettingsExpanded",
      currentDisplayState: {
        isSettingsExpanded: !panel.currentDisplayState.isSettingsExpanded,
      },
    });
  };

  const typeSpecificSettings = () => {
    if (isLetterPanelData(panel.typeData)) {
      return <LetterPanelSettings panelId={panel.id} typeData={panel.typeData} />;
    }
    if (isSearchPanelData(panel.typeData)) {
      return <SearchPanelSettings panelId={panel.id} typeData={panel.typeData} />;
    }
    if (isObscurityPanelData(panel.typeData)) {
      return <ObscurityPanelSettings panelId={panel.id} typeData={panel.typeData} />;
    }
    if (isDefinitionPanelData(panel.typeData)) {
      return <DefinitionPanelSettings panelId={panel.id} typeData={panel.typeData} />;
    }
  };

  return (
    <SettingsCollapsible
      isExpanded={panel.currentDisplayState.isSettingsExpanded}
      toggleIsExpanded={toggleExpanded}
    >
      {typeSpecificSettings()}
      <div className="GeneralPanelSettings">
        <PanelStatusTrackingControl panel={panel} />
        <PanelNameInputForm
          panel={panel}
          inputId={`PanelNameInput${uniqid()}`}
        />
        <PanelInitialDisplayControls panel={panel} />
      </div>
    </SettingsCollapsible>
  );
}
