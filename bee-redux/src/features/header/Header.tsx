import { FormEvent, useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { HeaderAuth } from "../auth/HeaderAuth";
import { SubheaderContext } from "../../app/SubheaderProvider";
import { Icon } from "@iconify/react";

export function Header() {
  const navigate = useNavigate();
  const { subheader } = useContext(SubheaderContext);

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
      {subheader ? <div className="subheader">{subheader}</div> : null}
    </header>
  );
}
