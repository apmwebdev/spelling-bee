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
  GridRow,
  StatusTrackingKeys,
  SubstringHintDataCell,
  SubstringHintOutputKeys,
} from "@/features/hintPanels";
import {
  SearchPanelBaseData,
  SearchPanelLocationKeys,
} from "@/features/searchPanel/types/searchPanelTypes";
import { createTypeGuard, isEnumValue } from "@/types/globalTypes";
import { isUuid, Uuid } from "@/features/api";

//If changing, change SearchPanelSearchProperties as well
export type SearchPanelSearchData = SearchPanelBaseData & {
  //inherits location, lettersOffset, and outputType
  uuid: Uuid;
  attemptUuid: Uuid;
  searchPanelUuid: Uuid;
  searchString: string;
  createdAt: number;
};

export const isSearchPanelSearch = createTypeGuard<SearchPanelSearchData>(
  ["uuid", isUuid],
  ["attemptUuid", isUuid],
  ["searchPanelUuid", isUuid],
  ["createdAt", "number"],
  ["searchString", "string"],
  ["location", isEnumValue(SearchPanelLocationKeys)],
  ["lettersOffset", "number"],
  ["outputType", isEnumValue(SubstringHintOutputKeys)],
);

export type ResultData = {
  searchObject: SearchPanelSearchData;
  results: GridRow;
  total: SubstringHintDataCell;
  excludedAnswers: number;
};

export type SearchResultProps = {
  panelUuid?: number;
  resultData: ResultData;
  statusTracking: StatusTrackingKeys;
};
