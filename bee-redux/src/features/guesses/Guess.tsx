import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { addGuess } from "./guessesSlice"

export function Guess() {
  const dispatch = useDispatch()
  const [guessValue, setGuessValue] = useState("")

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addGuess(guessValue))
    setGuessValue("")
  }

  return (
    <div className="sb-guess-input-container">
      <div className="sb-guess-input-alert"></div>
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
          onChange={(e) => setGuessValue(e.target.value)}
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
