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
import {
  selectKnownWordsListSettings,
  setKnownWordsSortOrder,
  setKnownWordsSortType,
  toggleKnownWordsSettingsCollapsed,
} from "@/features/wordLists";
import { KnownWordsStatus } from "./KnownWordsStatus";
import { KnownWordsSettings } from "./KnownWordsSettings";
import { getSortedGuessList } from "@/features/wordLists/util/wordListsUtil";
import { WordListContainer } from "@/features/wordLists/components/WordListContainer";
import { selectKnownAnswerGuesses } from "@/features/progress/api/progressSlice";

export function KnownWordsContainer() {
  const dispatch = useAppDispatch();
  const knownAnswerGuesses = useAppSelector(selectKnownAnswerGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectKnownWordsListSettings,
  );

  const generateSortedGuessWordList = () => {
    return getSortedGuessList({
      guessList: knownAnswerGuesses,
      sortType,
      sortOrder,
    });
  };

  return (
    <div className="KnownWordsContainer">
      <KnownWordsStatus />
      <WordListContainer
        wordList={generateSortedGuessWordList()}
        settingsData={{
          isExpanded: !settingsCollapsed,
          toggleIsExpanded: () => dispatch(toggleKnownWordsSettingsCollapsed()),
          settingsComponent: <KnownWordsSettings />,
        }}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortType={setKnownWordsSortType}
        setSortOrder={setKnownWordsSortOrder}
        emptyListMessage="No known words"
        allowPopovers={true}
      />
    </div>
  );
}
