/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { idb } from "@/lib/idb";

export const getIdbAttemptSearches = (attemptUuid: string) => {
  return idb.searchPanelSearches
    .where("attemptUuid")
    .equalsIgnoreCase(attemptUuid);
};

export const deleteIdbSearchPanelSearch = (uuid: string) => {
  return idb.searchPanelSearches.delete(uuid);
};
