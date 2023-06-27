import { FormEvent, useState } from "react"

import { useAppDispatch } from "../../app/hooks"
import { fetchAsync } from "../puzzle/puzzleSlice"

export function Header() {
  const dispatch = useAppDispatch()
  const [puzzleDate, setPuzzleDate] = useState("2023-06-20")

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(fetchAsync(puzzleDate))
  }

  return (
    <header className="sb-header">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="dateInput"
          value={puzzleDate}
          onChange={(e) => setPuzzleDate(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </header>
  )
}
