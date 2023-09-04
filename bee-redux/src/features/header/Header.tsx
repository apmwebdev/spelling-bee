import { Link } from "react-router-dom";
import { HeaderAuth } from "../auth/headerAuth/HeaderAuth";
import { PuzzleSearch } from "@/features/puzzleSearch/PuzzleSearch";
import "@/styles/header.scss";

export function Header() {
  return (
    <header className="SSB_Header">
      <div className="HeaderLeft">
        <Link to="/" className="HeaderTitle">
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
    </header>
  );
}
