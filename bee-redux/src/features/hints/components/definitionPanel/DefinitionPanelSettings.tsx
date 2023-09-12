import { DefinitionPanelData } from "@/features/hints";
import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
import { HintRevealedLettersControl } from "@/features/hints/components/settings/HintRevealedLettersControl";
import { HintRevealLengthControl } from "@/features/hints/components/settings/HintRevealLengthControl";
import { HintSortOrderControl } from "@/features/hints/components/settings/HintSortOrderControl";
import { HintSeparateKnownControl } from "@/features/hints/components/settings/HintSeparateKnownControl";
import { HintShowObscurityControl } from "@/features/hints/components/definitionPanel/HintShowObscurityControl";

export function DefinitionPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: DefinitionPanelData;
}) {
  return (
    <div className="DefinitionPanelSettings PanelSettings">
      <HintHideKnownControl panelId={panelId} showKnown={typeData.showKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
      <HintSeparateKnownControl
        panelId={panelId}
        separateKnown={typeData.separateKnown}
        disabled={!typeData.showKnown}
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
