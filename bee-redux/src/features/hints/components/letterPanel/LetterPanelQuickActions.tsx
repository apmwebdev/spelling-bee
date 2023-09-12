import { PanelCurrentDisplayState } from "@/features/hints/hintProfilesSlice";
import { LetterPanelData } from "@/features/hints";
import { QuickActions } from "@/features/hints/components/shared/QuickActions";
import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
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
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintNumberOfLettersControl
        panelId={panelId}
        numberOfLetters={typeData.numberOfLetters}
      />
    </QuickActions>
  );
}
