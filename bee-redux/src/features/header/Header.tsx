import { useContext } from "react";

import { Link, useLocation } from "react-router-dom";
import { HeaderAuth } from "../auth/headerAuth/HeaderAuth";
import { SubheaderContext } from "../../app/SubheaderProvider";
import { useAppSelector } from "../../app/hooks";
import { selectAnswers } from "../puzzle/puzzleSlice";

export function Header() {
  const { subheader } = useContext(SubheaderContext);
  const { pathname } = useLocation();
  const answers = useAppSelector(selectAnswers);

  const subheaderContent = () => {
    const pathArr = pathname.split("/");
    if (pathArr[1].match(/^puzzle(s)?$/) && answers.length > 0) {
      return subheader;
    }
  };

  return (
    <header className="sb-header">
      <div className="main-header">
        <div className="header-left">
          <Link to="/" className="title">
            Super Spelling Bee
          </Link>
          <Link to="/puzzles/latest">Today's Puzzle</Link>
          <Link to="/">All Puzzles</Link>
          <Link to="/">Help</Link>
          <Link to="/">About</Link>
        </div>
        <HeaderAuth />
      </div>
      {subheaderContent()}
    </header>
  );
}
