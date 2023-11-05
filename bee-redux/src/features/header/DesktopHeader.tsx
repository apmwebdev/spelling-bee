import { Link } from "react-router-dom";
import { PuzzleSearch } from "@/features/puzzleSearch";
import { HeaderAuth } from "@/features/auth";
import { HeaderTitle } from "@/features/header/HeaderTitle";

export function DesktopHeader() {
  return (
    <header className="Header___desktop Header___common">
      <div className="HeaderLeft">
        <HeaderTitle />
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
