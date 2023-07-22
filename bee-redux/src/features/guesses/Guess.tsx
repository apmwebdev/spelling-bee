import { FormEvent, useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {
  addGuess,
  GuessesFormat,
  GuessFormat,
  selectGuessesData,
} from "./guessesSlice"
import { useAppSelector } from "../../app/hooks"
import {
  selectAnswerWords,
  selectCenterLetter,
  selectValidLetters,
} from "../puzzle/puzzleSlice"
import { GuessAlerts } from "./GuessAlerts"

export function Guess() {
  const dispatch = useDispatch()
  const guesses = useAppSelector(selectGuessesData)
  const validLetters = useAppSelector(selectValidLetters)
  const centerLetter = useAppSelector(selectCenterLetter)
  const answers = useAppSelector(selectAnswerWords)
  const [guessValue, setGuessValue] = useState("")
  const [guessIsValid, setGuessIsValid] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [messagesType, setMessagesType] = useState<"" | "answer" | "error">("")

  enum ErrorTypes {
    TooShort = "Must be at least 4 letters",
    InvalidLetter = "Contains invalid letter(s)",
    MissingCenterLetter = "Must contain center letter",
    AlreadyGuessed = "Already guessed",
    AlreadyFound = "Already found",
  }

  const resetMessages = () => {
    setMessages([])
    setMessagesType("")
    setGuessIsValid(true)
  }

  /*
  This callback version of addError is necessary in order to use it inside the
  useEffect hook. It doesn't work properly otherwise.
   */
  const addErrorCallback = useCallback((errorMessage: ErrorTypes) => {
    setMessages((current) => [...current, errorMessage])
    setMessagesType("error")
    setGuessIsValid(false)
  }, [])

  const addError = (errorMessage: ErrorTypes) => {
    setMessages((current) => [...current, errorMessage])
    setMessagesType("error")
    setGuessIsValid(false)
  }

  const changeHandler = (userInput: string): void => {
    if (userInput.length < 16) {
      setGuessValue(userInput)
    }
  }

  useEffect(() => {
    if (guessValue !== "") {
      resetMessages()
    }
    if (
      guessValue !== "" &&
      !guessValue.match(new RegExp(`^[${validLetters.join("")}]+$`))
    ) {
      addErrorCallback(ErrorTypes.InvalidLetter)
    }
  }, [
    ErrorTypes.InvalidLetter,
    addErrorCallback,
    guessValue,
    messagesType,
    validLetters,
  ])

  const validateSubmission = () => {
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

    if (guessValue.length < 4) {
      addError(ErrorTypes.TooShort)
    }
    if (centerLetter && !guessValue.includes(centerLetter)) {
      addError(ErrorTypes.MissingCenterLetter)
    }
    const matchingGuess = getMatchingGuess(guesses, guessValue)
    if (matchingGuess) {
      if (matchingGuess.isAnswer) {
        addError(ErrorTypes.AlreadyFound)
      } else {
        addError(ErrorTypes.AlreadyGuessed)
      }
    }
    return guessIsValid
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateSubmission()) {
      const isAnswer = answers.includes(guessValue.toLowerCase())
      dispatch(
        addGuess({
          word: guessValue,
          isAnswer,
        }),
      )
      if (isAnswer) {
        setMessages([`${guessValue}`])
        setMessagesType("answer")
      }
    }
    setGuessValue("")
  }

  return (
    <div className="sb-guess-input-container">
      <GuessAlerts messages={messages} messagesType={messagesType} />
      <form
        id="sb-guess-input-form"
        name="sb-guess-input-form"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          id="sb-guess-input"
          name="sb-guess-input"
          autoComplete="off"
          value={guessValue}
          onChange={(e) => changeHandler(e.target.value.toLowerCase())}
        />
        <button
          type="submit"
          id="sb-guess-input-submit"
          className="standard-button"
          name="sb-guess-input-submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
