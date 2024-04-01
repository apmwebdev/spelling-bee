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
import { AlphaSortToggle } from "@/features/wordLists/components/AlphaSortToggle";
import { FoundSortToggle } from "@/features/wordLists/components/FoundSortToggle";
import { WordListContainerSettingsData } from "@/features/wordLists/components/WordListContainer";
import { SettingsToggle } from "@/components/SettingsToggle";
import { SettingsCollapsible } from "@/components/SettingsCollapsible";
import { SortType } from "@/features/wordLists/types/wordListTypes";
import { ReactElement } from "react";

export type WordListSortProps = {
  sortType: SortType;
  sortOrder: SortOrderKeys;
  setSortType?: Function;
  setSortOrder: Function;
};

export type WordListHeaderProps = WordListSortProps & {
  settingsData: WordListContainerSettingsData;
  additionalControls?: ReactElement;
};

export function WordListHeader(props: WordListHeaderProps) {
  const { settingsData, additionalControls, ...sortProps } = props;
  const { isExpanded, toggleIsExpanded, settingsComponent } = settingsData;
  const { sortType, setSortType } = sortProps;
  const generateToggles = () => {
    if (setSortType) {
      return (
        <>
          <AlphaSortToggle {...sortProps} />
          <FoundSortToggle {...sortProps} />
        </>
      );
    }
    if (sortType === SortType.Alphabetical) {
      return <AlphaSortToggle {...sortProps} />;
    }
    return <FoundSortToggle {...sortProps} />;
  };

  return (
    <header className="WordListHeader">
      <div className="WordListHeader_mainControls">
        <SettingsToggle
          isPressed={isExpanded}
          clickHandler={toggleIsExpanded}
        />
        <div className="WordListHeader_sortContainer">
          <span>Sort</span>
          <div className="ToggleGroupRoot">{generateToggles()}</div>
        </div>
        {additionalControls}
      </div>
      {isExpanded && (
        <SettingsCollapsible isExpanded={isExpanded}>
          {settingsComponent}
        </SettingsCollapsible>
      )}
    </header>
  );
}
