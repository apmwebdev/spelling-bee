import { ReactNode } from "react";
import { HintContentBlurButton } from "@/features/hintPanels/components/shared/HintContentBlurButton";
import { PanelCurrentDisplayState } from "@/features/hintPanels";

export function QuickActions({
  panelId,
  displayState,
  children,
}: {
  panelId: number;
  displayState: PanelCurrentDisplayState;
  children: ReactNode;
}) {
  return (
    <div className="HintPanelQuickActions">
      <HintContentBlurButton
        panelId={panelId}
        isBlurred={displayState.isBlurred}
      />
      {displayState.isSettingsExpanded ? null : children}
    </div>
  );
}
