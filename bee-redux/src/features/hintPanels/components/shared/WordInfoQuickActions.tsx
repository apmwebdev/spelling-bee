import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { DefinitionPanelData, ObscurityPanelData } from "@/features/hints";
import { HintRevealedLettersControl } from "@/features/hintPanels/components/settings/HintRevealedLettersControl";
import { QuickActions } from "@/features/hintPanels/components/shared/QuickActions";
import { PanelCurrentDisplayState } from "@/features/hintPanels";

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
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
    </QuickActions>
  );
}
