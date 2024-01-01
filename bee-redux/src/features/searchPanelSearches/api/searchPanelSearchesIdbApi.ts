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
  createBulkAddIdbDataFn,
  createIdbUuidUpdateFn,
  idb,
  idbInsertWithRetry,
} from "@/lib/idb";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { Uuid } from "@/types";

export const getIdbAttemptSearches = (attemptUuid: Uuid) => {
  return idb.searchPanelSearches
    .where("attemptUuid")
    .equals(attemptUuid)
    .toArray();
};

export const addIdbSearchPanelSearch =
  idbInsertWithRetry<SearchPanelSearchData>(
    idb.searchPanelSearches.add.bind(idb.searchPanelSearches),
  );

export const bulkAddIdbSearchPanelSearches = createBulkAddIdbDataFn(
  addIdbSearchPanelSearch,
);

export const deleteIdbSearchPanelSearch = (uuid: Uuid) => {
  return idb.searchPanelSearches.delete(uuid);
};

export const updateIdbSearchPanelSearchUuids = createIdbUuidUpdateFn(
  idb.searchPanelSearches,
);
