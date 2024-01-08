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
import { selectCorrectGuesses, TGuess } from "@/features/guesses";
import {
  selectFoundWordsListSettings,
  SortType,
  toggleFoundWordsSettingsCollapsed,
} from "@/features/wordLists";
import { WordListScroller } from "../WordListScroller";
import { FoundWordsStatus } from "./FoundWordsStatus";
import { FoundWordsListHeader } from "./FoundWordsListHeader";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { FoundWordsSettings } from "./FoundWordsSettings";
import { SortOrderKeys } from "@/types/globalTypes";

export function FoundWordsContainer() {
  const dispatch = useAppDispatch();
  const correctGuesses = useAppSelector(selectCorrectGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectFoundWordsListSettings,
  );

  const generateDisplayGuessList = () => {
    let displayGuessList: TGuess[] = [];
    if (correctGuesses.length === 0) {
      return displayGuessList;
    }

    displayGuessList = [...correctGuesses];

    if (sortType === SortType.Alphabetical) {
      displayGuessList.sort((a, b) => {
        if (a.text < b.text) {
          return sortOrder === SortOrderKeys.asc ? -1 : 1;
        }
        if (a.text > b.text) {
          return sortOrder === SortOrderKeys.asc ? 1 : -1;
        }
        return 0;
      });
    } else {
      displayGuessList.sort((a, b) => {
        if (sortOrder === SortOrderKeys.asc) {
          return a.createdAt - b.createdAt;
        }
        return b.createdAt - a.createdAt;
      });
    }

    return displayGuessList;
  };

  const guessListContent = () => {
    const displayGuessList = generateDisplayGuessList();
    const wordsOnly = displayGuessList.map((guess) => guess.text);
    if (wordsOnly.length > 0) {
      return (
        <div className="WordListContainer">
          <FoundWordsListHeader />
          <WordListScroller wordList={wordsOnly} allowPopovers={true} />
        </div>
      );
    }
    return <div className="WordList empty">No found words</div>;
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
      {guessListContent()}
    </div>
  );
}
