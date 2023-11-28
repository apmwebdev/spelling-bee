/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ChangeEvent } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function HintRevealedLettersControl({
  panelUuid,
  revealedLetters,
}: {
  panelUuid: string;
  revealedLetters: number;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleRevealedLettersChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      uuid: panelUuid,
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
