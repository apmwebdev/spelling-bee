import { HintPanelFormat, setSettingsAreCollapsed } from "../hintProfilesSlice";
import { GeneralPanelSettings } from "./GeneralPanelSettings";
import { ComponentType } from "react";
import { SettingsHeader } from "./generalControls/SettingsHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/utils/HeaderDisclosureWidget";
import { useDispatch } from "react-redux";

interface HintPanelSettingsProps {
  panel: HintPanelFormat;
  TypeSettingsComponent?: ComponentType;
}

export function HintPanelSettings({
  panel,
  TypeSettingsComponent,
}: HintPanelSettingsProps) {
  const dispatch = useDispatch();
  const toggleCollapsed = () => {
    dispatch(
      setSettingsAreCollapsed({
        panelId: panel.id,
        settingsAreCollapsed: !panel.settingsAreCollapsed,
      }),
    );
  };

  return (
    <Collapsible.Root
      className="sb-hint-panel-settings collapsible-settings"
      open={!panel.settingsAreCollapsed}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="sb-hint-panel-settings-header-button collapsible-settings-header-button"
            onClick={toggleCollapsed}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content className="sb-hint-panel-settings-content">
        {TypeSettingsComponent && <TypeSettingsComponent />}
        <GeneralPanelSettings panel={panel} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
