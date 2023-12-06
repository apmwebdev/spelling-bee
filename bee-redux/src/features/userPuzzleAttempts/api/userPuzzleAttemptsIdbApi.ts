/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { idb, idbInsertWithRetry } from "@/lib/idb";
import { Uuid } from "@/types";
import { AttemptFormat } from "@/features/userPuzzleAttempts";

export const getIdbPuzzleAttempts = (puzzleId: number) => {
  return idb.attempts.where("puzzleId").equals(puzzleId).toArray();
};

/** If successful, returns the UUID of the inserted record. If unsuccessful, returns null. */
export const addIdbAttempt = idbInsertWithRetry<AttemptFormat>(
  idb.attempts.add,
);

export const deleteIdbAttempt = (attemptUuid: Uuid) => {
  return idb.attempts.delete(attemptUuid);
};
