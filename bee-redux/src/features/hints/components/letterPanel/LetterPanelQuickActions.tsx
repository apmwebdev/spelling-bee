import { PanelCurrentDisplayState } from "@/features/hints/hintProfilesSlice";
import { LetterPanelData } from "@/features/hints";
import { QuickActions } from "@/features/hints/components/shared/QuickActions";
import { HintShowKnownControl } from "@/features/hints/components/settings/HintShowKnownControl";
import { HintNumberOfLettersControl } from "@/features/hints/components/letterPanel/HintNumberOfLettersControl";

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
      <HintShowKnownControl panelId={panelId} showKnown={typeData.showKnown} />
      <HintNumberOfLettersControl
        panelId={panelId}
        numberOfLetters={typeData.numberOfLetters}
      />
    </QuickActions>
  );
}
