/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
