/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { SortOrderKeys } from "@/types/globalTypes";
import { WordListHeader } from "@/features/wordLists/components/WordListHeader";
import { WordListScroller } from "@/features/wordLists/components/WordListScroller";
import { ReactElement } from "react";
import { SortType } from "@/features/wordLists/types/wordListTypes";
import { TGuess } from "@/features/guesses";

export type WordListContainerSettingsData = {
  isExpanded: boolean;
  toggleIsExpanded: (state: boolean) => any;
  settingsComponent: ReactElement;
};

export function WordListContainer({
  wordList,
  settingsData,
  sortType,
  sortOrder,
  setSortType,
  setSortOrder,
  emptyListMessage,
  allowPopovers,
  useSpoilers,
}: {
  wordList: string[] | TGuess[];
  settingsData: WordListContainerSettingsData;
  sortType: SortType;
  sortOrder: SortOrderKeys;
  setSortType?: Function;
  setSortOrder: Function;
  emptyListMessage: string;
  allowPopovers: boolean;
  useSpoilers?: boolean;
}) {
  return (
    <div className="WordListContainer">
      <WordListHeader
        settingsData={settingsData}
        sortType={sortType}
        sortOrder={sortOrder}
        setSortType={setSortType}
        setSortOrder={setSortOrder}
      />
      {wordList.length > 0 ? (
        <WordListScroller
          wordList={wordList}
          allowPopovers={allowPopovers}
          useSpoilers={useSpoilers}
        />
      ) : (
        <div className="WordList empty">{emptyListMessage}</div>
      )}
    </div>
  );
}
