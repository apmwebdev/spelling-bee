import { GeneralPanelSettings } from "./GeneralPanelSettings";
import { ReactNode } from "react";
import { SettingsHeader } from "../../../components/SettingsHeader";
import * as Collapsible from "@radix-ui/react-collapsible";
import { HeaderDisclosureWidget } from "@/components/HeaderDisclosureWidget";
import { HintPanelData } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";

interface HintPanelSettingsProps {
  panel: HintPanelData;
  children: ReactNode;
}

export function HintPanelSettings({ panel, children }: HintPanelSettingsProps) {
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

  return (
    <SettingsCollapsible
      isExpanded={panel.currentDisplayState.isSettingsExpanded}
      toggleIsExpanded={toggleExpanded}
    >
      {children}
      <GeneralPanelSettings panel={panel} />
    </SettingsCollapsible>
  );
}
