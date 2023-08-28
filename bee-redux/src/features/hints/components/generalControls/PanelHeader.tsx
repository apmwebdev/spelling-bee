import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";

interface PanelHeaderProps {
  panelId: number;
  isExpanded: boolean;
  children: ReactNode;
}

export function PanelHeader({
  panelId,
  isExpanded,
  children,
}: PanelHeaderProps) {
  const cssClasses = () => {
    let classList = "HintPanelHeader click-header-to-collapse";
    if (isExpanded) {
      classList += " expanded";
    } else {
      classList += " collapsed";
    }
    return classList;
  };

  return (
    <header className={cssClasses()}>
      <div className="sb-hint-panel-header-buttons-left">
        <DuplicateButton panelId={panelId} />
      </div>
      {children}
      <div className="sb-hint-panel-header-buttons-right">
        <RemoveButton panelId={panelId} />
      </div>
    </header>
  );
}
