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

export function HintNumberOfLettersControl({
  panelUuid,
  numberOfLetters,
}: {
  panelUuid: string;
  numberOfLetters: number;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updatePanel({
      uuid: panelUuid,
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
