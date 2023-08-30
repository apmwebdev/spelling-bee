import { ChangeEvent } from "react";
import { LetterPanelData } from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";
import { LetterPanelLocationControl } from "@/features/hints/components/panels/letter/settings/LetterPanelLocationControl";

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

  const handleNumberOfLettersChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // const payload: ChangeLetterPanelNumberOfLettersPayload = {
    //   panelId,
    //   newValue: Number(e.target.value),
    // };
    // dispatch(changeLetterPanelNumberOfLetters(payload));
  };
  const numOfLettersControl = () => {
    return (
      <input
        className="sb-number-of-letters-control"
        type="number"
        value={numberOfLetters}
        onChange={handleNumberOfLettersChange}
      />
    );
  };

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // const payload: ChangeLetterPanelOffsetPayload = {
    //   panelId,
    //   newValue: Number(e.target.value),
    // };
    // dispatch(changeLetterPanelOffset(payload));
  };

  const offsetControl = () => {
    return (
      <input
        className="sb-offset-control"
        type="number"
        value={lettersOffset}
        onChange={handleOffsetChange}
      />
    );
  };

  return (
    <div className="LetterPanelSettings">
      <HintOutputTypeControl panelId={panelId} outputType={outputType} />
      <div className="number-of-letters-section">
        <span>Number of letters:</span> {numOfLettersControl()}
      </div>
      <LetterPanelLocationControl panelId={panelId} location={location} />
      <div className="offset-section">
        <span>Offset:</span> {offsetControl()}
      </div>
    </div>
  );
}
