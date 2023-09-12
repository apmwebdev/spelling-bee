import { PanelCurrentDisplayState } from "@/features/hints/hintProfilesSlice";
import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
import { DefinitionPanelData, ObscurityPanelData } from "@/features/hints";
import { HintRevealedLettersControl } from "@/features/hints/components/settings/HintRevealedLettersControl";
import { QuickActions } from "@/features/hints/components/shared/QuickActions";

export function WordInfoQuickActions({
  panelId,
  displayState,
  typeData,
}: {
  panelId: number;
  displayState: PanelCurrentDisplayState;
  typeData: ObscurityPanelData | DefinitionPanelData;
}) {
  return (
    <QuickActions panelId={panelId} displayState={displayState}>
      <HintHideKnownControl panelId={panelId} showKnown={typeData.showKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
    </QuickActions>
  );
}
