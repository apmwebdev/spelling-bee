/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { PanelTypes, SubstringHintOutputKeys } from "@/features/hintPanels";
import { EnumeratedOptions } from "@/types";

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
  searchString: string;
  location: SearchPanelLocationKeys;
  lettersOffset: number;
  outputType: SubstringHintOutputKeys;
};
export type SearchPanelData = SearchPanelBaseData & {
  panelType: PanelTypes;
  // ID is necessary for search panels so that searches know which panel they
  // belong to
  uuid: string;
};

export function isSearchPanelData(a: any): a is SearchPanelData {
  return a.panelType === PanelTypes.Search;
}
