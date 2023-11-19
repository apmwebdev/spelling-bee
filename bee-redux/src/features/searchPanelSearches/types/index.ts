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
} from "@/features/hintPanels";
import { SearchPanelBaseData } from "@/features/hintPanelType_search";

export type SearchPanelSearchData = SearchPanelBaseData & {
  //includes searchString, location, lettersOffset, and outputType through inheritance
  attemptId: number;
  searchPanelId: number;
  createdAt: number;
  id?: number;
};

export type ResultData = {
  searchObject: SearchPanelSearchData;
  results: GridRow;
  total: SubstringHintDataCell;
  excludedAnswers: number;
};

export type SearchResultProps = {
  panelId?: number;
  resultData: ResultData;
  statusTracking: StatusTrackingKeys;
};

export type SpsDeleteArgs = { id?: number; createdAt: number };
