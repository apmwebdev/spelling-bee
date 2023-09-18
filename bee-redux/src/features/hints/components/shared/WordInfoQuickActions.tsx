import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
import {
  DefinitionPanelData,
  ObscurityPanelData,
  PanelCurrentDisplayState,
} from "@/features/hints";
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
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
    </QuickActions>
  );
}
