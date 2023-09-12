import { ObscurityPanelData } from "@/features/hints";
import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
import { HintSeparateKnownControl } from "@/features/hints/components/settings/HintSeparateKnownControl";
import { HintRevealedLettersControl } from "@/features/hints/components/settings/HintRevealedLettersControl";
import { HintSortOrderControl } from "@/features/hints/components/settings/HintSortOrderControl";
import { HintRevealLengthControl } from "@/features/hints/components/settings/HintRevealLengthControl";
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
