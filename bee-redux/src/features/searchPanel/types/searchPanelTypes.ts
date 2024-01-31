/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  isHintPanel,
  PanelTypes,
  SubstringHintOutputKeys,
  THintPanel,
} from "@/features/hintPanels";
import {
  createTypeGuard,
  EnumeratedOptions,
  isEnumValue,
} from "@/types/globalTypes";
import { isUuid, Uuid } from "@/features/api";

/**
 * For search panels, should it search for the search string at the start,
 * end, or anywhere in the puzzle words?
 */
export enum SearchPanelLocationKeys {
  Start = "start",
  End = "end",
  Anywhere = "anywhere",
}

export const SearchPanelLocationOptions: EnumeratedOptions = {
  start: { title: "Start of Word" },
  end: { title: "End of Word" },
  anywhere: { title: "Anywhere in Word" },
};

export type SearchPanelBaseData = {
  location: SearchPanelLocationKeys;
  lettersOffset: number;
  outputType: SubstringHintOutputKeys;
};

export type SearchPanelData = SearchPanelBaseData & {
  panelType: PanelTypes;
  // Uuid is necessary for the SearchPanel object itself, not just the parent HintPanel object,
  // because search panel searches belong to search panels, not hint panels.
  uuid: Uuid;
};

export const isSearchPanelData = createTypeGuard<SearchPanelData>(
  ["location", isEnumValue(SearchPanelLocationKeys)],
  ["lettersOffset", "number"],
  ["outputType", isEnumValue(SubstringHintOutputKeys)],
  ["uuid", isUuid],
  ["panelType", (prop) => prop === PanelTypes.Search],
);

export type TSearchPanel = THintPanel & { typeData: SearchPanelData };

export const isSearchPanel = (toTest: any): toTest is TSearchPanel => {
  return isHintPanel(toTest) && isSearchPanelData(toTest.typeData);
};
