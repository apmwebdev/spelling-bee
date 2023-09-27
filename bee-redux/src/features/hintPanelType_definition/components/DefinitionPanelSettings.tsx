import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintRevealedLettersControl } from "@/features/hintPanels/components/settings/HintRevealedLettersControl";
import { HintRevealLengthControl } from "@/features/hintPanels/components/settings/HintRevealLengthControl";
import { HintSortOrderControl } from "@/features/hintPanels/components/settings/HintSortOrderControl";
import { HintSeparateKnownControl } from "@/features/hintPanels/components/settings/HintSeparateKnownControl";
import { HintShowObscurityControl } from "@/features/hintPanelType_definition/components/HintShowObscurityControl";
import { DefinitionPanelData } from "../";

export function DefinitionPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: DefinitionPanelData;
}) {
  return (
    <div className="DefinitionPanelSettings PanelSettings">
      <HintHideKnownControl panelId={panelId} hideKnown={typeData.hideKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
      <HintSeparateKnownControl
        panelId={panelId}
        separateKnown={typeData.separateKnown}
        disabled={typeData.hideKnown}
      />
      <HintShowObscurityControl
        panelId={panelId}
        showObscurity={typeData.showObscurity}
      />
      <HintRevealLengthControl
        panelId={panelId}
        revealLength={typeData.revealLength}
      />
      <HintSortOrderControl panelId={panelId} sortOrder={typeData.sortOrder} />
    </div>
  );
}
