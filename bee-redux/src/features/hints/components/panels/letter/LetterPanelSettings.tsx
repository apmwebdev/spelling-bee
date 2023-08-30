import { ChangeEvent } from "react";
import { capitalize } from "lodash";
import { LetterPanelData, LetterPanelLocations } from "@/features/hints";
import { HintOutputTypeControl } from "@/features/hints/components/settings/HintOutputTypeControl";

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

  const handleLocationInWordChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    // const payload: ChangeLetterPanelLocationInWordPayload = {
    //   panelId,
    //   newValue: e.target.value as LetterPanelLocations,
    // };
    // dispatch(changeLetterPanelLocationInWord(payload));
  };

  const locationInWordControl = () => {
    return (
      <select value={location} onChange={handleLocationInWordChange}>
        <option value={LetterPanelLocations.Start}>
          {capitalize(LetterPanelLocations.Start)} of word
        </option>
        <option value={LetterPanelLocations.End}>
          {capitalize(LetterPanelLocations.End)} of word
        </option>
      </select>
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
      <div className="location-in-word-section">
        <span>Start from:</span> {locationInWordControl()}
      </div>
      <div className="offset-section">
        <span>Offset:</span> {offsetControl()}
      </div>
    </div>
  );
}
