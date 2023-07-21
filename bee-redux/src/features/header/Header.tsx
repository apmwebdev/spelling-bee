import { FormEvent, useState } from "react"

import { useNavigate } from "react-router-dom"

export function Header() {
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("")
  const navigate = useNavigate()

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    return navigate(`/puzzle/${puzzleIdentifier}`)
  }

  return (
    <header className="sb-header">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="identifierInput"
          value={puzzleIdentifier}
          onChange={(e) => setPuzzleIdentifier(e.target.value)}
        />
        <button type="submit" className="standard-button">
          Submit
        </button>
      </form>
    </header>
  )
}
