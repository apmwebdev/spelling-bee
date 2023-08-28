import { RemoveButton } from "./RemoveButton";
import { DuplicateButton } from "./DuplicateButton";
import { ReactNode } from "react";

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
    let classList = "HintPanelHeader click-header-to-collapse";
    if (isPanelExpanded) {
      classList += " expanded";
    } else {
      classList += " collapsed";
    }
    return classList;
  };

  return (
    <header className={cssClasses()}>
      <div className="HintPanelHeaderButtonsLeft">
        <DuplicateButton panelId={panelId} />
      </div>
      {children}
      <div className="HintPanelHeaderButtonsRight">
        <RemoveButton panelId={panelId} />
      </div>
    </header>
  );
}
