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
import uniqid from "uniqid"
import { capitalize } from "lodash"

interface LetterPanelSettingsProps {
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
        <option key={uniqid()} value={StringHintDisplayOptions.WordLengthGrid}>
          Word Length Grid
        </option>
        <option key={uniqid()} value={StringHintDisplayOptions.WordCountList}>
          Word Count List
        </option>
        <option key={uniqid()} value={StringHintDisplayOptions.LettersOnly}>
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
        <option key={uniqid()} value={LetterPanelLocations.Beginning}>
          {capitalize(LetterPanelLocations.Beginning)}
        </option>
        <option key={uniqid()} value={LetterPanelLocations.End}>
          {capitalize(LetterPanelLocations.End)}
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
        <span key={uniqid()}>Type:</span> {displayControl()}
      </div>
      <div className="number-of-letters-section">
        <span key={uniqid()}>Number of letters:</span> {numOfLettersControl()}
      </div>
      <div className="location-in-word-section">
        <span key={uniqid()}>Start from:</span> {locationInWordControl()}
      </div>
      <div className="offset-section">
        <span key={uniqid()}>Offset:</span> {offsetControl()}
      </div>
    </div>
  )
}
