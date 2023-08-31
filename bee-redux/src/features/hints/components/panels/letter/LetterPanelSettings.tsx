import { ChangeEvent } from "react";
import { LetterPanelData, PanelTypes } from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";
import { HintLocationControl } from "@/features/hints/components/settings/HintLocationControl";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { HintShowKnownControl } from "@/features/hints/components/settings/HintShowKnownControl";
import { HintLettersOffsetControl } from "@/features/hints/components/settings/HintLettersOffsetControl";

export interface LetterPanelSettingsProps {
  panelId: number;
  typeData: LetterPanelData;
}

export function LetterPanelSettings({
  panelId,
  typeData,
}: LetterPanelSettingsProps) {
  const { numberOfLetters, location, lettersOffset, outputType, showKnown } =
    typeData;
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();

  const handleNumberOfLettersChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      id: panelId,
      debounceField: "numberOfLetters",
      typeData: {
        numberOfLetters: Number(e.target.value),
      },
    });
  };

  return (
    <div className="LetterPanelSettings">
      <HintOutputTypeControl panelId={panelId} outputType={outputType} />
      <div>
        <span>Number of letters:</span>
        <input
          className="LetterPanelNumberOfLettersInput"
          type="number"
          value={numberOfLetters}
          min={1}
          max={answerLengths.length ? answerLengths.slice(-1)[0] : 0}
          onChange={handleNumberOfLettersChange}
        />
      </div>
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
      <HintShowKnownControl panelId={panelId} showKnown={showKnown} />
    </div>
  );
}
