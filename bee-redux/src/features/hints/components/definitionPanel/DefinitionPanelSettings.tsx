import { DefinitionPanelData } from "@/features/hints";
import { HintShowKnownControl } from "@/features/hints/components/settings/HintShowKnownControl";
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
  /*
  showObscurity
  sortOrder
   */
  return (
    <div className="DefinitionPanelSettings PanelSettings">
      <HintShowKnownControl panelId={panelId} showKnown={typeData.showKnown} />
      <HintRevealedLettersControl
        panelId={panelId}
        revealedLetters={typeData.revealedLetters}
      />
      <HintSeparateKnownControl
        panelId={panelId}
        separateKnown={typeData.showKnown}
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
