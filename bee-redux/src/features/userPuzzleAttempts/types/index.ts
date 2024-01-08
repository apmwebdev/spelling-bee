/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { hasAllProperties } from "@/types/globalTypes";
import { BLANK_UUID, isUuid, Uuid } from "@/features/api";

export type UserPuzzleAttempt = {
  uuid: Uuid;
  puzzleId: number;
  createdAt: number;
  // guesses: TGuess[];
};

export const isUserPuzzleAttempt = (
  toTest: any,
): toTest is UserPuzzleAttempt => {
  if (!hasAllProperties(toTest, ["uuid", "puzzleId", "createdAt"])) {
    return false;
  }
  if (!isUuid(toTest.uuid)) return false;
  if (!(typeof toTest.puzzleId === "number")) return false;
  if (!(typeof toTest.createdAt === "number")) return false;
  return true;
};

export const BLANK_ATTEMPT: UserPuzzleAttempt = {
  uuid: BLANK_UUID,
  puzzleId: 0,
  createdAt: 0,
};

export const isBlankAttempt = (attempt: UserPuzzleAttempt) => {
  if (!hasAllProperties(attempt, ["uuid", "puzzleId", "createdAt"])) {
    return false;
  }
  if (attempt.uuid !== BLANK_UUID) return false;
  if (attempt.puzzleId !== 0) return false;
  if (attempt.createdAt !== 0) return false;
  return true;
};

export type RailsUserPuzzleAttempt = {
  uuid: Uuid;
  puzzle_id: number;
  created_at: number;
};
