import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";
import { DragHandle } from "@/features/hintPanels/components/shared/DragHandle";
import { SettingsToggle } from "@/features/hintPanels/components/shared/SettingsToggle";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface PanelHeaderProps {
  panelId: number;
  isPanelExpanded: boolean;
  children: ReactNode;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

export function PanelHeader({
  panelId,
  isPanelExpanded,
  children,
  attributes,
  listeners,
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
        <DragHandle attributes={attributes} listeners={listeners} />
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
