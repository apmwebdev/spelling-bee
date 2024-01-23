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
import {
  selectExcludedWordsListSettings,
  setExcludedWordsSortOrder,
  toggleExcludedWordsSettingsCollapsed,
} from "@/features/wordLists";
import { WordListContainer } from "@/features/wordLists/components/WordListContainer";
import { SortOrderKeys } from "@/types/globalTypes";
import { ExcludedWordsSettings } from "@/features/wordLists/components/excludedWords/ExcludedWordsSettings";

export function ExcludedWordsContainer() {
  const dispatch = useAppDispatch();
  const excludedWords = useAppSelector(selectExcludedWords);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectExcludedWordsListSettings,
  );
  const generateSortedWordList = () => {
    const displayList = [...excludedWords];
    if (sortOrder === SortOrderKeys.asc) return displayList.sort();
    return displayList.sort().reverse();
  };

  return (
    <div className="ExcludedWordsContainer">
      <div className="WordListStatus">
        There are{" "}
        <span className="WordListStatusCount">{excludedWords.length}</span>{" "}
        words excluded from this puzzle.
      </div>
      <WordListContainer
        wordList={generateSortedWordList()}
        settingsData={{
          isExpanded: !settingsCollapsed,
          toggleIsExpanded: () =>
            dispatch(toggleExcludedWordsSettingsCollapsed()),
          settingsComponent: <ExcludedWordsSettings />,
        }}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortOrder={setExcludedWordsSortOrder}
        emptyListMessage="No excluded words"
        allowPopovers={false}
      />
    </div>
  );
}
