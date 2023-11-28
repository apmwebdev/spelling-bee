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
import { AttemptFormat } from "@/features/userPuzzleAttempts";

export const getIdbPuzzleAttempts = (puzzleId: number) => {
  return idb.attempts.where("puzzleId").equals(puzzleId);
};

export const addIdbAttempt = (attempt: AttemptFormat) => {
  return idb.attempts.add(attempt);
};

export const deleteIdbAttempt = (attemptUuid: string) => {
  return idb.attempts.delete(attemptUuid);
};
