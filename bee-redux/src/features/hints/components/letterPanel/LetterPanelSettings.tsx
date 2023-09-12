import { LetterPanelData, PanelTypes } from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";
import { HintLocationControl } from "@/features/hints/components/settings/HintLocationControl";
import { HintHideKnownControl } from "@/features/hints/components/settings/HintHideKnownControl";
import { HintLettersOffsetControl } from "@/features/hints/components/settings/HintLettersOffsetControl";
import { HintNumberOfLettersControl } from "@/features/hints/components/letterPanel/HintNumberOfLettersControl";

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
