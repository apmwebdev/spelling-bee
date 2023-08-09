import { Link, useLocation } from "react-router-dom";
import { HeaderAuth } from "../auth/headerAuth/HeaderAuth";
import { PuzzleSubheader } from "../puzzle/PuzzleSubheader";

export function Header() {
  const { pathname } = useLocation();

  const subheaderContent = () => {
    const pathArr = pathname.split("/");
    if (pathArr[1].match(/^puzzle(s)?$/) || pathname === "/") {
      return <PuzzleSubheader />;
    }
  };

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
        </div>
        <HeaderAuth />
      </div>
      <div className="subheader">{subheaderContent()}</div>
    </header>
  );
}
