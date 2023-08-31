import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { ChangeEvent } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";

export function HintLettersOffsetControl({
  panelId,
  lettersOffset,
  numberOfLetters,
}: {
  panelId: number;
  lettersOffset: number;
  numberOfLetters?: number;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();

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
    <div className="HintLettersOffsetControl">
      <span>Offset:</span>
      <input
        className="LetterPanelOffsetInput"
        type="number"
        value={lettersOffset}
        min={0}
        max={
          answerLengths.length
            ? answerLengths.slice(-1)[0] - (numberOfLetters ?? 0)
            : 0
        }
        onChange={handleOffsetChange}
      />
    </div>
  );
}
