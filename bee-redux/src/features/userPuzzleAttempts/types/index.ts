/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { BLANK_UUID, Uuid } from "@/types";

export type AttemptFormat = {
  uuid: Uuid;
  puzzleId: number;
  createdAt: number;
  // guesses: GuessFormat[];
};

export const BLANK_ATTEMPT: AttemptFormat = {
  uuid: BLANK_UUID,
  puzzleId: 0,
  createdAt: 0,
};
