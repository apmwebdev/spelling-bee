/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { WordListSortProps } from "@/features/wordLists/components/WordListHeader";
import { useAppDispatch } from "@/app/hooks";
import { SortOrderKeys } from "@/types/globalTypes";
import { SortType } from "@/features/wordLists/types/wordListTypes";

export function FoundSortToggle(props: WordListSortProps) {
  const dispatch = useAppDispatch();
  const { sortType, sortOrder, setSortType, setSortOrder } = props;
  const getToggleLabel = () => {
    if (sortType === SortType.FoundOrder && sortOrder === SortOrderKeys.desc) {
      return "Last → First";
    }
    return "First → Last";
  };

  const handleClick = () => {
    if (sortType === SortType.FoundOrder) {
      if (sortOrder === SortOrderKeys.asc) {
        dispatch(setSortOrder(SortOrderKeys.desc));
      } else {
        dispatch(setSortOrder(SortOrderKeys.asc));
      }
      return;
    }
    if (setSortType) dispatch(setSortType(SortType.FoundOrder));
    if (sortOrder !== SortOrderKeys.asc) {
      dispatch(setSortOrder(SortOrderKeys.asc));
    }
  };

  return (
    <button
      type="button"
      className="ToggleGroupItem"
      onClick={handleClick}
      data-state={sortType === SortType.FoundOrder ? "on" : "off"}
    >
      {getToggleLabel()}
    </button>
  );
}
