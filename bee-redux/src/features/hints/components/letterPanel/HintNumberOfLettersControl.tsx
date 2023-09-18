import { ChangeEvent } from "react";
import { useUpdateHintPanelMutation } from "@/features/hints";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle";

export function HintNumberOfLettersControl({
  panelId,
  numberOfLetters,
}: {
  panelId: number;
  numberOfLetters: number;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      id: panelId,
      debounceField: "numberOfLetters",
      typeData: {
        numberOfLetters: Number(e.target.value),
      },
    });
  };
  return (
    <div className="NumberOfLettersControl">
      <span>Number of Letters:</span>
      <input
        className="LetterPanelNumberOfLettersInput"
        type="number"
        value={numberOfLetters}
        min={1}
        max={answerLengths.length ? answerLengths.slice(-1)[0] : 0}
        onChange={handleChange}
      />
    </div>
  );
}
