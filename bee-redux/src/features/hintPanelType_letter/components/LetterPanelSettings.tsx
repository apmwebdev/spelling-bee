import { HintOutputTypeControl } from "@/features/hintPanels/components/settings/HintOutputTypeControl";
import { HintLocationControl } from "@/features/hintPanels/components/settings/HintLocationControl";
import { HintHideKnownControl } from "@/features/hintPanels/components/settings/HintHideKnownControl";
import { HintLettersOffsetControl } from "@/features/hintPanels/components/settings/HintLettersOffsetControl";
import { HintNumberOfLettersControl } from "@/features/hintPanelType_letter/components/HintNumberOfLettersControl";
import { LetterPanelData } from "@/features/hintPanelType_letter";
import { PanelTypes } from "@/features/hintPanels";

export function LetterPanelSettings({
  panelId,
  typeData,
}: {
  panelId: number;
  typeData: LetterPanelData;
}) {
  const { numberOfLetters, location, lettersOffset, outputType, hideKnown } =
    typeData;
  return (
    <div className="LetterPanelSettings PanelSettings">
      <HintOutputTypeControl panelId={panelId} outputType={outputType} />
      <HintNumberOfLettersControl
        panelId={panelId}
        numberOfLetters={typeData.numberOfLetters}
      />
      <HintLocationControl
        panelId={panelId}
        location={location}
        panelType={PanelTypes.Letter}
      />
      <HintLettersOffsetControl
        panelId={panelId}
        lettersOffset={lettersOffset}
        numberOfLetters={numberOfLetters}
      />
      <HintHideKnownControl panelId={panelId} hideKnown={hideKnown} />
    </div>
  );
}
