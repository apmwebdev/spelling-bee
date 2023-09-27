import { ChangeEvent, CSSProperties, ReactNode } from "react";
import { useAppSelector } from "@/app/hooks";
import { selectAnswerLengths } from "@/features/puzzle";
import { maybeAddDisabledClass } from "@/util";
import { BasicTooltip } from "@/components/BasicTooltip";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function HintLettersOffsetControl({
  panelId,
  lettersOffset,
  numberOfLetters,
  disabled,
  disabledTooltip,
  style,
}: {
  panelId: number;
  lettersOffset: number;
  numberOfLetters?: number;
  disabled?: boolean;
  disabledTooltip?: ReactNode;
  style?: CSSProperties;
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
    <BasicTooltip disabled={!disabled} tooltipContent={disabledTooltip}>
      <div
        className={maybeAddDisabledClass("HintLettersOffsetControl", disabled)}
        style={style}
      >
        <span>Offset:</span>
        <input
          className="HintOffsetInput"
          type="number"
          value={lettersOffset}
          min={0}
          max={
            answerLengths.length
              ? answerLengths.slice(-1)[0] - (numberOfLetters ?? 0)
              : 0
          }
          disabled={disabled}
          onChange={handleOffsetChange}
        />
      </div>
    </BasicTooltip>
  );
}
