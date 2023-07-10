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
          word length grid
        </option>
        <option key={uniqid()} value={StringHintDisplayOptions.WordCountList}>
          word count list
        </option>
        <option key={uniqid()} value={StringHintDisplayOptions.LettersOnly}>
          letters only
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
          first
        </option>
        <option key={uniqid()} value={LetterPanelLocations.End}>
          last
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
      Show me
      {display === StringHintDisplayOptions.LettersOnly ? "" : " a"}{" "}
      {displayControl()} for the {locationInWordControl()}{" "}
      {numOfLettersControl()} {numberOfLetters > 1 ? "letters" : "letter"},{" "}
      offset by {offsetControl()} letters.
    </div>
  )
}
