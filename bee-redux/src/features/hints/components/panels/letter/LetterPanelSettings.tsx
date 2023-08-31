import { ChangeEvent } from "react";
import { LetterPanelData, PanelSubTypeTypes } from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";
import { LetterPanelLocationControl } from "@/features/hints/components/panels/letter/settings/LetterPanelLocationControl";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { HintShowKnownControl } from "@/features/hints/components/settings/HintShowKnownControl";

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

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      id: panelId,
      debounceField: "offset",
      typeData: {
        lettersOffset: Number(e.target.value),
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
      <LetterPanelLocationControl panelId={panelId} location={location} />
      <div>
        <span>Offset:</span>
        <input
          className="LetterPanelOffsetInput"
          type="number"
          value={lettersOffset}
          min={0}
          max={
            answerLengths.length
              ? answerLengths.slice(-1)[0] - numberOfLetters
              : 0
          }
          onChange={handleOffsetChange}
        />
      </div>
      <HintShowKnownControl panelId={panelId} showKnown={showKnown} />
    </div>
  );
}
