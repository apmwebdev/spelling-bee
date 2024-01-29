/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createTypeGuard } from "@/types/globalTypes";
import {
  createTypedSuccessResponseTypeGuard,
  isUuid,
  Uuid,
} from "@/features/api";

export type RailsGuessFormat = {
  uuid: Uuid;
  user_puzzle_attempt_uuid: Uuid;
  text: string;
  created_at: number;
  is_spoiled: boolean;
};

export type RailsGuessFormData = {
  guess: RailsGuessFormat;
};

/** The guess format returned from the server */
export type RawGuess = {
  uuid: Uuid;
  attemptUuid: Uuid;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
};

export const isRawGuess = createTypeGuard<RawGuess>(
  ["uuid", isUuid],
  ["attemptUuid", isUuid],
  ["text", "string"],
  ["createdAt", "number"],
  ["isSpoiled", "boolean"],
);

/** Validates that a value is both a successful RTKQ response (i.e., it has a `data` property), and
 *  that the data property is a valid raw guess. */
export const isRawGuessResponse =
  createTypedSuccessResponseTypeGuard<RawGuess>(isRawGuess);

/** The processed guess format used in Redux and saved in IndexedDB */
export type TGuess = RawGuess & {
  isAnswer: boolean;
  isExcluded: boolean;
};

export const isGuess = createTypeGuard<TGuess>(
  ["uuid", isUuid],
  ["attemptUuid", isUuid],
  ["text", "string"],
  ["createdAt", "number"],
  ["isSpoiled", "boolean"],
  ["isAnswer", "boolean"],
  ["isExcluded", "boolean"],
);
