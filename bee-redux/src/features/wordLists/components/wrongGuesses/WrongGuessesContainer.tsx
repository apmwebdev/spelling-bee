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
import { selectWrongGuesses } from "@/features/guesses";
import {
  selectWrongGuessesListSettings,
  setWrongGuessesSortOrder,
  setWrongGuessesSortType,
  toggleWrongGuessesSettingsCollapsed,
} from "@/features/wordLists";
import { getSortedGuessWordList } from "@/features/wordLists/util/wordListsUtil";
import { WordListContainer } from "@/features/wordLists/components/WordListContainer";
import { WrongGuessesSettings } from "@/features/wordLists/components/wrongGuesses/WrongGuessesSettings";

export function WrongGuessesContainer() {
  const dispatch = useAppDispatch();
  const wrongGuesses = useAppSelector(selectWrongGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectWrongGuessesListSettings,
  );

  const generateSortedGuessWordList = () => {
    return getSortedGuessWordList({
      guessList: wrongGuesses,
      sortType,
      sortOrder,
    });
  };

  return (
    <div>
      <div className="WordListStatus">
        You've made{" "}
        <span className="WordListStatusCount">{wrongGuesses.length}</span>{" "}
        incorrect {wrongGuesses.length === 1 ? "guess" : "guesses"}.
      </div>
      <WordListContainer
        wordList={generateSortedGuessWordList()}
        settingsData={{
          isExpanded: !settingsCollapsed,
          toggleIsExpanded: () =>
            dispatch(toggleWrongGuessesSettingsCollapsed()),
          settingsComponent: <WrongGuessesSettings />,
        }}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortType={setWrongGuessesSortType}
        setSortOrder={setWrongGuessesSortOrder}
        emptyListMessage="No incorrect guesses"
        allowPopovers={false}
      />
    </div>
  );
}
