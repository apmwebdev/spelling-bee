import { FormEvent, useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  PuzzleStatuses,
  selectDate,
  selectPuzzleStatus,
} from "../puzzle/puzzleSlice";
import { HeaderAuth } from "../auth/HeaderAuth";
import { SubheaderContext } from "../../app/SubheaderProvider";

export function Header() {
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("");
  const navigate = useNavigate();
  const status = useAppSelector(selectPuzzleStatus);
  const puzzleDate = useAppSelector(selectDate);
  const { subheader } = useContext(SubheaderContext);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return navigate(`/puzzle/${puzzleIdentifier}`);
  };

  return (
    <header className="sb-header">
      <div className="main-header">
        <div className="header-left">
          <Link to="/" className="title">
            Super Spelling Bee
          </Link>
          <Link to="/puzzles/latest">Today's Puzzle</Link>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifierInput"
              value={puzzleIdentifier}
              placeholder="Date, ID, or letters"
              onChange={(e) => setPuzzleIdentifier(e.target.value)}
            />
            <button type="submit" className="standard-button">
              Find Puzzle
            </button>
          </form>
        </div>
        <HeaderAuth />
      </div>
      {subheader ? <div className="subheader">{subheader}</div> : null}
    </header>
  );
}
