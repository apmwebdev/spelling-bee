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
import {
  SearchPanelBaseData,
  SearchPanelLocationKeys,
} from "@/features/hintPanelType_search";
import { hasAllProperties, isUuid, Uuid } from "@/types";
import { devLog } from "@/util";

//If changing, change SearchPanelSearchProperties as well
export type SearchPanelSearchData = SearchPanelBaseData & {
  //inherits searchString, location, lettersOffset, and outputType
  uuid: Uuid;
  attemptUuid: Uuid;
  searchPanelUuid: Uuid;
  createdAt: number;
};

export const SearchPanelSearchProperties = [
  "uuid",
  "attemptUuid",
  "searchPanelUuid",
  "createdAt",
  "searchString",
  "location",
  "lettersOffset",
  "outputType",
];

export const isSearchPanelSearch = (
  toTest: any,
): toTest is SearchPanelSearchData => {
  if (!hasAllProperties(toTest, SearchPanelSearchProperties)) {
    devLog("Doesn't have all properties");
    return false;
  }
  if (!isUuid(toTest.uuid)) {
    devLog("uuid isn't a UUID");
    return false;
  }
  if (!isUuid(toTest.attemptUuid)) {
    devLog("attemptUuid isn't a UUID");
    return false;
  }
  if (!isUuid(toTest.searchPanelUuid)) {
    devLog("searchPanelUuid isn't a UUID");
    return false;
  }
  if (!(typeof toTest.createdAt === "number")) {
    devLog("createdAt isn't a number");
    return false;
  }
  if (!(typeof toTest.searchString === "string")) {
    devLog("searchString isn't a string");
    return false;
  }
  if (!(typeof toTest.location === "string")) {
    devLog("Invalid location", SearchPanelLocationKeys);
    return false;
  }
  if (!(typeof toTest.lettersOffset === "number")) {
    devLog("lettersOffset isn't a number");
    return false;
  }
  if (!(typeof toTest.outputType === "string")) {
    devLog("Invalid outputType");
    return false;
  }
  return true;
};

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
