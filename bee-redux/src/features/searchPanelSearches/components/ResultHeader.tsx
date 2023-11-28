/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import {
  deleteSearchPanelSearch,
  SearchPanelSearchData,
} from "@/features/searchPanelSearches";
import { useAppDispatch } from "@/app/hooks";

export function ResultHeader({
  searchObject,
}: {
  searchObject: SearchPanelSearchData;
}) {
  const dispatch = useAppDispatch();
  const { searchString } = searchObject;

  const handleClickRemoveButton = () => {
    dispatch(deleteSearchPanelSearch(searchObject.uuid));
  };

  return (
    <header className="SearchHintSearchResultHeader">
      <IconButton
        type={IconButtonTypeKeys.Delete}
        className="SearchResultHeaderRemoveButton"
        onClick={handleClickRemoveButton}
        tooltip="Delete search"
      />
      <div className="search-result-title">Search: "{searchString}"</div>
    </header>
  );
}
