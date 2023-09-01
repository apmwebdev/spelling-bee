import { Link } from "react-router-dom";
import { HeaderAuth } from "../auth/headerAuth/HeaderAuth";
import { PuzzleSearch } from "@/features/puzzleSearch/PuzzleSearch";

export function Header() {

  return (
    <header className="sb-header">
      <div className="main-header">
        <div className="header-left">
          <Link to="/" className="title">
            Super Spelling Bee
          </Link>
          <Link to="/puzzles/latest">Latest Puzzle</Link>
          <Link to="/">All Puzzles</Link>
          <Link to="/">Stats</Link>
          <Link to="/">Help</Link>
          <Link to="/">About</Link>
          <PuzzleSearch />
        </div>
        <HeaderAuth />
      </div>
    </header>
  );
}
