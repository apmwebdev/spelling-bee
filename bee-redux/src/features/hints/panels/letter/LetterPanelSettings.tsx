import {
  changeLetterPanelDisplay,
  ChangeLetterPanelDisplayPayload,
  changeLetterPanelLocationInWord,
  ChangeLetterPanelLocationInWordPayload,
  changeLetterPanelNumberOfLetters,
  ChangeLetterPanelNumberOfLettersPayload,
  changeLetterPanelOffset,
  ChangeLetterPanelOffsetPayload,
  LetterPanelLocations,
  StringHintDisplayOptions,
} from "../../hintProfilesSlice"
import { useDispatch } from "react-redux"
import { ChangeEvent } from "react"
import { capitalize } from "lodash"

export interface LetterPanelSettingsProps {
  panelId: number
  numberOfLetters: number
  locationInWord: LetterPanelLocations
  offset: number
  display: StringHintDisplayOptions
}

export function LetterPanelSettings({
  panelId,
  numberOfLetters,
  locationInWord,
  offset,
  display,
}: LetterPanelSettingsProps) {
  const dispatch = useDispatch()

  const handleDisplayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload: ChangeLetterPanelDisplayPayload = {
      panelId,
      newValue: e.target.value as StringHintDisplayOptions,
    }
    dispatch(changeLetterPanelDisplay(payload))
  }

  const displayControl = () => {
    return (
      <select value={display} onChange={handleDisplayChange}>
        <option value={StringHintDisplayOptions.WordLengthGrid}>
          Word Length Grid
        </option>
        <option value={StringHintDisplayOptions.WordCountList}>
          Word Count List
        </option>
        <option value={StringHintDisplayOptions.LettersOnly}>
          Letters Only
        </option>
      </select>
    )
  }

  const handleNumberOfLettersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const payload: ChangeLetterPanelNumberOfLettersPayload = {
      panelId,
      newValue: Number(e.target.value),
    }
    dispatch(changeLetterPanelNumberOfLetters(payload))
  }
  const numOfLettersControl = () => {
    return (
      <input
        className="sb-number-of-letters-control"
        type="number"
        value={numberOfLetters}
        onChange={handleNumberOfLettersChange}
      />
    )
  }

  const handleLocationInWordChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const payload: ChangeLetterPanelLocationInWordPayload = {
      panelId,
      newValue: e.target.value as LetterPanelLocations,
    }
    dispatch(changeLetterPanelLocationInWord(payload))
  }

  const locationInWordControl = () => {
    return (
      <select value={locationInWord} onChange={handleLocationInWordChange}>
        <option value={LetterPanelLocations.Beginning}>
          {capitalize(LetterPanelLocations.Beginning)} of word
        </option>
        <option value={LetterPanelLocations.End}>
          {capitalize(LetterPanelLocations.End)} of word
        </option>
      </select>
    )
  }

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const payload: ChangeLetterPanelOffsetPayload = {
      panelId,
      newValue: Number(e.target.value),
    }
    dispatch(changeLetterPanelOffset(payload))
  }

  const offsetControl = () => {
    return (
      <input
        className="sb-offset-control"
        type="number"
        value={offset}
        onChange={handleOffsetChange}
      />
    )
  }

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
  )
}
