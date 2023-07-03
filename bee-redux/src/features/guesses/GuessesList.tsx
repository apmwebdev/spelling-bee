import { useAppSelector } from "../../app/hooks"
import { selectGuesses } from "./guessesSlice"

export function GuessesList() {
  const guesses = useAppSelector(selectGuesses)

  const guessesList = () => {
    if (guesses?.guesses) {
      return (
        <ul>
          {guesses.guesses.map((guess) => {
            return <li key={guess.word}>{guess.word}</li>
          })}
        </ul>
      )
    }
    return <div>No guesses</div>
  }
  return <div className="guess-list">{guessesList()}</div>
}
