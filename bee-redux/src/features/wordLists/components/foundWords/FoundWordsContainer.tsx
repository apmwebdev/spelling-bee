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
import { selectCorrectGuesses } from "@/features/guesses";
import {
  selectFoundWordsListSettings,
  setFoundWordsSortOrder,
  setFoundWordsSortType,
  toggleFoundWordsSettingsCollapsed,
} from "@/features/wordLists";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { FoundWordsSettings } from "./FoundWordsSettings";
import { getSortedGuessWordList } from "@/features/wordLists/util/wordListsUtil";
import { WordListContainer } from "@/features/wordLists/components/WordListContainer";

export function FoundWordsContainer() {
  const dispatch = useAppDispatch();
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectFoundWordsListSettings,
  );

  const generateSortedGuessWordList = () => {
    return getSortedGuessWordList({
      guessList: correctGuesses,
      sortType,
      sortOrder,
    });
  };

  return (
    <div className="FoundWordsContainer">
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() => dispatch(toggleFoundWordsSettingsCollapsed())}
      >
        <FoundWordsSettings />
      </SettingsCollapsible>
      <FoundWordsStatus />
      <WordListContainer
        wordList={generateSortedGuessWordList()}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortType={setFoundWordsSortType}
        setSortOrder={setFoundWordsSortOrder}
        emptyListMessage="No found words"
        allowPopovers={true}
      />
    </div>
  );
}
