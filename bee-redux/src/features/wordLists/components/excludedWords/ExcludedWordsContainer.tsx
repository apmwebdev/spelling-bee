/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectExcludedWords } from "@/features/puzzle";
import { WordListScroller } from "../WordListScroller";
import { ExcludedWordsListHeader } from "./ExcludedWordsListHeader";
import {
  selectExcludedWordsListSettings,
  toggleExcludedWordsSettingsCollapsed,
} from "@/features/wordLists";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { SortOrderKeys } from "@/types";

export function ExcludedWordsContainer() {
  const dispatch = useAppDispatch();
  const excludedWords = useAppSelector(selectExcludedWords);
  const { sortOrder, settingsCollapsed } = useAppSelector(
    selectExcludedWordsListSettings,
  );
  const displayList = [...excludedWords];

  return (
    <div className="ExcludedWordsContainer">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() =>
          dispatch(toggleExcludedWordsSettingsCollapsed())
        }
      >
        blah
      </SettingsCollapsible>
      <div className="WordListStatus">
        There are{" "}
        <span className="WordListStatusCount">{excludedWords.length}</span>{" "}
        words excluded from this puzzle.
      </div>
      <div className="WordListContainer">
        <ExcludedWordsListHeader />
        <WordListScroller
          wordList={
            sortOrder === SortOrderKeys.asc
              ? displayList
              : displayList.reverse()
          }
          allowPopovers={false}
        />
      </div>
    </div>
  );
}
