import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { DragHandle } from "@/features/hints/components/shared/DragHandle";
import { SettingsToggle } from "@/features/hints/components/shared/SettingsToggle";

interface PanelHeaderProps {
  panelId: number;
  isPanelExpanded: boolean;
  children: ReactNode;
}

export function PanelHeader({
  panelId,
  isPanelExpanded,
  children,
}: PanelHeaderProps) {
  const cssClasses = () => {
    let classList = "HintPanelHeader";
    if (isPanelExpanded) {
      classList += " expanded";
    } else {
      classList += " collapsed";
    }
    return classList;
  };

  return (
    <header className={cssClasses()}>
      <div className="PanelHeaderButtonGroup">
        <DragHandle />
        <SettingsToggle panelId={panelId} />
      </div>
      {children}
      <div className="PanelHeaderButtonGroup">
        <DuplicateButton panelId={panelId} />
        <RemoveButton panelId={panelId} />
      </div>
    </header>
  );
}
