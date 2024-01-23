/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { SortType } from "@/features/wordLists";
import { SortOrderKeys } from "@/types/globalTypes";
import { AlphaSortToggle } from "@/features/wordLists/components/AlphaSortToggle";
import { FoundSortToggle } from "@/features/wordLists/components/FoundSortToggle";

export type WordListHeaderProps = {
  sortType: SortType;
  sortOrder: SortOrderKeys;
  setSortType?: Function;
  setSortOrder: Function;
};

export function WordListHeader(props: WordListHeaderProps) {
  const { sortType, setSortType } = props;
  const generateToggles = () => {
    if (setSortType) {
      return (
        <>
          <AlphaSortToggle {...props} />
          <FoundSortToggle {...props} />
        </>
      );
    }
    if (sortType === SortType.Alphabetical) {
      return <AlphaSortToggle {...props} />;
    }
    return <FoundSortToggle {...props} />;
  };

  return (
    <header>
      <div>
        <span>Sort</span>
        <div className="ToggleGroupRoot">{generateToggles()}</div>
      </div>
    </header>
  );
}
