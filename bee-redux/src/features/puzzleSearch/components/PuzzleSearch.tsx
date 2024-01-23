/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Icon } from "@iconify/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function PuzzleSearch() {
  const navigate = useNavigate();
  const [puzzleIdentifier, setPuzzleIdentifier] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return navigate(`/puzzle/${puzzleIdentifier}`);
  };

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-zA-Z0-9]*$/)) {
      setPuzzleIdentifier(e.target.value);
    }
  };

  return (
    <div className="PuzzleSearch">
      <form className="PuzzleSearchForm" onSubmit={handleSearch}>
        <Icon icon="mdi:search" className="PuzzleSearchForm_searchSymbol" />
        <input
          type="text"
          className="PuzzleSearchForm_searchInput"
          name="identifierInput"
          value={puzzleIdentifier}
          placeholder="Date, ID, or letters"
          onChange={(e) => handleSearchInput(e)}
        />
      </form>
    </div>
  );
}
