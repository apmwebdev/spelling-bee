import { GeneralPanelSettings } from "./GeneralPanelSettings";
import { ReactNode } from "react";
import { SettingsHeader } from "./generalControls/SettingsHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { useDispatch } from "react-redux";
import { HintPanelData } from "@/features/hints";

interface HintPanelSettingsProps {
  panel: HintPanelData;
  children: ReactNode;
}

export function HintPanelSettings({ panel, children }: HintPanelSettingsProps) {
  const dispatch = useDispatch();
  const toggleCollapsed = () => {
    // dispatch(
    //   setSettingsAreCollapsed({
    //     panelId: panel.id,
    //     settingsAreCollapsed: !panel.settingsAreCollapsed,
    //   }),
    // );
  };

  return (
    <Collapsible.Root
      className="SettingsCollapsible"
      open={panel.currentDisplayState.isSettingsExpanded}
    >
      <SettingsHeader>
        <Collapsible.Trigger asChild>
          <button
            className="SettingsCollapsibleHeaderButton"
            onClick={toggleCollapsed}
          >
            <HeaderDisclosureWidget title="Settings" />
          </button>
        </Collapsible.Trigger>
      </SettingsHeader>
      <Collapsible.Content className="sb-hint-panel-settings-content">
        {children}
        <GeneralPanelSettings panel={panel} />
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
