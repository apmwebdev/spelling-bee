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
  SortType,
  toggleWrongGuessesSettingsCollapsed,
} from "@/features/wordLists";
import { WrongGuessesListContainer } from "./WrongGuessesListContainer";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { SortOrderKeys } from "@/types";

export function WrongGuessesContainer() {
  const dispatch = useAppDispatch();
  const wrongGuesses = useAppSelector(selectWrongGuesses);
  const { sortType, sortOrder, settingsCollapsed } = useAppSelector(
    selectWrongGuessesListSettings,
  );

  const generateDisplayGuessList = () => {
    if (wrongGuesses.length === 0) {
      return [];
    }

    const displayGuessList = [...wrongGuesses];
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

    return displayGuessList.map((guess) => guess.text);
  };

  return (
    <div>
      <SettingsCollapsible
        isExpanded={!settingsCollapsed}
        toggleIsExpanded={() => dispatch(toggleWrongGuessesSettingsCollapsed())}
      >
        No content
      </SettingsCollapsible>
      <div className="WordListStatus">
        You've made{" "}
        <span className="WordListStatusCount">{wrongGuesses.length}</span>{" "}
        incorrect {wrongGuesses.length === 1 ? "guess" : "guesses"}.
      </div>
      <WrongGuessesListContainer wordList={generateDisplayGuessList()} />
    </div>
  );
}
