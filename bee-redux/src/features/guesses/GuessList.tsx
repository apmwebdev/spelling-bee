import { useAppSelector } from "../../app/hooks"
import { GuessFormat, selectGuessesData } from "./guessesSlice"
import { GuessListSettings } from "./GuessListSettings"
import {
  GuessListSettingsFormat,
  selectGuessListSettings,
  SortOrder,
  SortType,
} from "./guessListSettingsSlice"

export function GuessList() {
  const guessesData = useAppSelector(selectGuessesData)
  const guestListSettings = useAppSelector(selectGuessListSettings)

  const generateDisplayGuessList = (
    { sortType, sortOrder, showWrongGuesses }: GuessListSettingsFormat,
    guesses: GuessFormat[],
  ) => {
    let displayGuessList: GuessFormat[] = []
    if (guesses.length === 0) {
      return displayGuessList
    }

    if (!showWrongGuesses) {
      displayGuessList = guesses.filter((guess) => guess.isAnswer)
    } else {
      displayGuessList = [...guesses]
    }

    if (sortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.word < b.word) {
          return sortOrder === SortOrder.Ascending ? -1 : 1
        }
        if (a.word > b.word) {
          return sortOrder === SortOrder.Ascending ? 1 : -1
        }
        return 0
      })
    } else {
      displayGuessList.sort((a, b) => {
        if (sortOrder === SortOrder.Ascending) {
          return a.timestamp - b.timestamp
        }
        return b.timestamp - a.timestamp
      })
    }

    return displayGuessList
  }

  const guessListContent = () => {
    const displayGuessList = generateDisplayGuessList(
      guestListSettings,
      guessesData.guesses,
    )
    if (displayGuessList.length > 0) {
      return (
        <ul className="sb-guess-list">
          {displayGuessList.map((guess) => {
            return <li key={guess.word}>{guess.word}</li>
          })}
        </ul>
      )
    }
    return <div>No guesses</div>
  }
  return (
    <div className="sb-guess-list-section">
      <GuessListSettings />
      {guessListContent()}
    </div>
  )
}
