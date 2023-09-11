import { ChangeEvent } from "react";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle/puzzleSlice";

export function HintRevealedLettersControl({
  panelId,
  revealedLetters,
}: {
  panelId: number;
  revealedLetters: number;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleRevealedLettersChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      id: panelId,
      debounceField: "revealedLetters",
      typeData: {
        revealedLetters: Number(e.target.value),
      },
    });
  };
  return (
    <div className="HintRevealedLettersControl">
      <span>Revealed Letters:</span>
      <input
        className="HintRevealedLettersInput"
        type="number"
        value={revealedLetters}
        min={0}
        max={answerLengths.length ? answerLengths.slice(-1)[0] : 0}
        onChange={handleRevealedLettersChange}
      />
    </div>
  );
}
