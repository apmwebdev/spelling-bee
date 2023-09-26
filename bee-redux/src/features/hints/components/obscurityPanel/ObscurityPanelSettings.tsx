import { ObscurityPanelData } from "@/features/hints";
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintSeparateKnownControl } from "@/features/hintPanels/components/settings/HintSeparateKnownControl";
import { HintRevealedLettersControl } from "@/features/hintPanels/components/settings/HintRevealedLettersControl";
import { HintSortOrderControl } from "@/features/hintPanels/components/settings/HintSortOrderControl";
import { HintRevealLengthControl } from "@/features/hintPanels/components/settings/HintRevealLengthControl";
import { HintClickToDefineControl } from "@/features/hints/components/obscurityPanel/HintClickToDefineControl";

export function ObscurityPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: ObscurityPanelData;
}) {
  return (
    <div className="ObscurityPanelSettings PanelSettings">
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
      <HintClickToDefineControl
        panelId={panelId}
        clickToDefine={typeData.clickToDefine}
      />
      <HintRevealLengthControl
        panelId={panelId}
        revealLength={typeData.revealLength}
      />
      <HintSortOrderControl panelId={panelId} sortOrder={typeData.sortOrder} />
    </div>
  );
}
