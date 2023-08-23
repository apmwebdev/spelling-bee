import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";

interface PanelHeaderProps {
  panelId: number;
  isCollapsed: boolean;
  children: ReactNode;
}

export function PanelHeader({
  panelId,
  isCollapsed,
  children,
}: PanelHeaderProps) {
  const cssClasses = () => {
    let classList = "HintPanelHeader click-header-to-collapse";
    if (isCollapsed) {
      classList += " collapsed";
    } else {
      classList += " expanded";
    }
    return classList;
  };

  return (
    <header className={cssClasses()}>
      <div className="sb-hint-panel-header-buttons-left">
        <RemoveButton panelId={panelId} />
      </div>
      {children}
      <div className="sb-hint-panel-header-buttons-right">
        <DuplicateButton panelId={panelId} />
      </div>
    </header>
  );
}
