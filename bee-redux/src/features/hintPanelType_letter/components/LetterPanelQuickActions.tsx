import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintNumberOfLettersControl } from "./HintNumberOfLettersControl";
import { PanelCurrentDisplayState } from "@/features/hintPanels";
import { LetterPanelData } from "@/features/hintPanelType_letter";

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
