/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { FormEvent, useState } from "react";
import { addSearchPanelSearchThunk } from "@/features/searchPanelSearches";
import { useAppDispatch } from "@/app/hooks";
import { useSelector } from "react-redux";
import { selectCurrentAttemptUuid } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsSlice";
import { SearchPanelData } from "@/features/searchPanel";

export function SearchPanelForm({
  searchPanelData,
}: {
  searchPanelData: SearchPanelData;
}) {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const currentAttemptUuid = useSelector(selectCurrentAttemptUuid);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO: Add debounce here
    dispatch(
      addSearchPanelSearchThunk({
        uuid: crypto.randomUUID(),
        searchPanelUuid: searchPanelData.uuid,
        attemptUuid: currentAttemptUuid,
        searchString: searchValue,
        location: searchPanelData.location,
        lettersOffset: searchPanelData.lettersOffset,
        outputType: searchPanelData.outputType,
        createdAt: Date.now(),
      }),
    );
    setSearchValue("");
  };

  return (
    <form className="SearchPanelForm" onSubmit={handleSubmit}>
      <input
        type="search"
        className="SearchHintInput"
        value={searchValue}
        placeholder="Search..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button type="submit" className="standardButton">
        Search
      </button>
    </form>
  );
}
