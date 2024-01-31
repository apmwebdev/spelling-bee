/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { CSSProperties, ReactNode } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle";
import { BasicTooltip } from "@/components/BasicTooltip";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";
import classNames from "classnames/dedupe";

import { Uuid } from "@/features/api";
import { NumberInput } from "@/components/NumberInput";

export function HintLettersOffsetControl({
  panelUuid,
  lettersOffset,
  numberOfLetters,
  disabled,
  disabledTooltip,
  style,
}: {
  panelUuid: Uuid;
  lettersOffset: number;
  numberOfLetters?: number;
  disabled?: boolean;
  disabledTooltip?: ReactNode;
  style?: CSSProperties;
}) {
  const answerLengths = useAppSelector(selectAnswerLengths);
  const [updatePanel] = useUpdateHintPanelMutation();

  const updateValue = (newValue: number) => {
    updatePanel({
      uuid: panelUuid,
      debounceField: "offset",
      typeData: {
        lettersOffset: newValue,
      },
    });
  };

  return (
    <BasicTooltip disabled={!disabled} tooltipContent={disabledTooltip}>
      <div
        className={classNames("HintLettersOffsetControl", {
          disabled: disabled,
        })}
        style={style}
      >
        <span>Offset:</span>
        <NumberInput
          className="HintOffsetInput"
          value={lettersOffset}
          min={0}
          max={
            answerLengths.length
              ? answerLengths.slice(-1)[0] - (numberOfLetters ?? 0)
              : 0
          }
          disabled={disabled}
          updateFn={updateValue}
        />
      </div>
    </BasicTooltip>
  );
}
