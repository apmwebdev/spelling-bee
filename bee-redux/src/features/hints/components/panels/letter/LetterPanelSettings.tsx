import { useDispatch } from "react-redux";
import { ChangeEvent } from "react";
import { capitalize } from "lodash";
import {
  LetterPanelLocations,
  SubstringHintOutputTypes,
} from "@/features/hints";

export interface LetterPanelSettingsProps {
  panelId: number;
  numberOfLetters: number;
  location: LetterPanelLocations;
  lettersOffset: number;
  outputType: SubstringHintOutputTypes;
}

export function LetterPanelSettings({
  panelId,
  numberOfLetters,
  location,
  lettersOffset,
  outputType,
}: LetterPanelSettingsProps) {
  const dispatch = useDispatch();

  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    // const payload: ChangeLetterPanelDisplayPayload = {
    //   panelId,
    //   newValue: e.target.value as SubstringHintOutputTypes,
    // };
    // dispatch(changeLetterPanelDisplay(payload));
  };

  const displayControl = () => {
    return (
      <select value={outputType} onChange={handleDisplayChange}>
        <option value={SubstringHintOutputTypes.WordLengthGrid}>
          Word Length Grid
        </option>
        <option value={SubstringHintOutputTypes.WordCountList}>
          Word Count List
        </option>
        <option value={SubstringHintOutputTypes.LettersList}>
          Letters Only
        </option>
      </select>
    );
  };

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
    <div className="sb-letter-panel-settings">
      <div className="display-section">
        <span>Type:</span> {displayControl()}
      </div>
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
