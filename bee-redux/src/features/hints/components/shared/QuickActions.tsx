import { PanelCurrentDisplayState } from "@/features/hints";
import { ReactNode } from "react";
import { HintContentBlurButton } from "@/features/hints/components/shared/HintContentBlurButton";

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
