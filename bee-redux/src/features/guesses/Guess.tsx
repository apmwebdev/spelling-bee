import { FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  addGuess,
  GuessesFormat,
  GuessFormat,
  selectGuesses,
} from "./guessesSlice"
import { useAppSelector } from "../../app/hooks"
import {
  selectAnswers,
  selectCenterLetter,
  selectValidLetters,
} from "../puzzle/puzzleSlice"
import { GuessAlerts } from "./GuessAlerts"

export function Guess() {
  const dispatch = useDispatch()
  const guesses = useAppSelector(selectGuesses)
  const validLetters = useAppSelector(selectValidLetters)
  const centerLetter = useAppSelector(selectCenterLetter)
  const answers = useAppSelector(selectAnswers)
  const [guessValue, setGuessValue] = useState("")
  const [guessIsValid, setGuessIsValid] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  enum ErrorTypes {
    None = "",
    TooShort = "Must be at least 4 letters",
    InvalidLetter = "Contains invalid letter(s)",
    MissingCenterLetter = "Must contain center letter",
    AlreadyGuessed = "Already guessed",
    AlreadyFound = "Already found",
  }

  const validateInput = (userInput: string): void => {
    if (userInput.length < 16) {
      setGuessValue(userInput)
    }
  }

  useEffect(() => {
    setGuessIsValid(true)
    setErrorMessages([])
    const lettersAreValid = (validLetters: string[] | undefined) => {
      let returnVal = true
      const guessSplit = guessValue.split("")
      for (const letter of guessSplit) {
        if (validLetters && !validLetters.includes(letter)) {
          returnVal = false
          break
        }
      }
      return returnVal
    }

    if (!lettersAreValid(validLetters)) {
      setGuessIsValid(false)
      setErrorMessages((current) => [...current, ErrorTypes.InvalidLetter])
    }
  }, [ErrorTypes.InvalidLetter, guessValue, validLetters])

  const getMatchingGuess = (guesses: GuessesFormat, guessValue: string) => {
    let matchingGuess: GuessFormat | null = null
    for (const guessObject of guesses.guesses) {
      if (guessObject.word === guessValue) {
        matchingGuess = guessObject
        break
      }
    }
    return matchingGuess
  }

  const validateSubmission = () => {
    let submissionIsValid = guessIsValid
    if (guessValue.length < 4) {
      submissionIsValid = false
      setErrorMessages((current) => [...current, ErrorTypes.TooShort])
    }
    if (centerLetter && !guessValue.includes(centerLetter)) {
      submissionIsValid = false
      setErrorMessages((current) => [
        ...current,
        ErrorTypes.MissingCenterLetter,
      ])
    }
    const matchingGuess = getMatchingGuess(guesses, guessValue)
    if (matchingGuess) {
      submissionIsValid = false
      if (matchingGuess.isAnswer) {
        setErrorMessages((current) => [...current, ErrorTypes.AlreadyFound])
      } else {
        setErrorMessages((current) => [...current, ErrorTypes.AlreadyGuessed])
      }
    }
    return submissionIsValid
  }

  const guessIsAnswer = (userInput: string, answers: string[] | undefined) => {
    return !!(answers && answers.includes(userInput.toLowerCase()))
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateSubmission()) {
      dispatch(
        addGuess({
          word: guessValue,
          isAnswer: guessIsAnswer(guessValue, answers),
        }),
      )
      setGuessValue("")
    }
  }

  return (
    <div className="sb-guess-input-container">
      <GuessAlerts errorMessages={errorMessages} />
      <form
        id="sb-guess-input-form"
        name="sb-guess-input-form"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          id="sb-guess-input"
          name="sb-guess-input"
          value={guessValue}
          onChange={(e) => validateInput(e.target.value.toUpperCase())}
        />
        <button
          type="submit"
          id="sb-guess-input-submit"
          name="sb-guess-input-submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
