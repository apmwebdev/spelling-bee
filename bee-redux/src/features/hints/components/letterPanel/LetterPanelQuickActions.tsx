import { LetterPanelData } from "@/features/hints";
import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintNumberOfLettersControl } from "@/features/hints/components/letterPanel/HintNumberOfLettersControl";
import { PanelCurrentDisplayState } from "@/features/hintPanels";

export function LetterPanelQuickActions({
  panelId,
  displayState,
  typeData,
}: {
  panelId: number;
  displayState: PanelCurrentDisplayState;
  typeData: LetterPanelData;
}) {
  return (
    <QuickActions panelId={panelId} displayState={displayState}>
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintNumberOfLettersControl
        panelId={panelId}
        numberOfLetters={typeData.numberOfLetters}
      />
    </QuickActions>
  );
}
