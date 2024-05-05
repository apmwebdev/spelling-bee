/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { getIdbPuzzleAttempts } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsIdbApi";
import { UserPuzzleData } from "@/features/userData";
import { getIdbAttemptGuesses } from "@/features/guesses/api/guessesIdbApi";
import { last } from "lodash";
import { BLANK_UUID } from "@/features/api";
import { getIdbAttemptSearches } from "@/features/searchPanelSearches/api/searchPanelSearchesIdbApi";

export const getIdbUserPuzzleData = async (
  puzzleId: number,
): Promise<UserPuzzleData> => {
  const attempts = await getIdbPuzzleAttempts(puzzleId);
  if (attempts.length === 0) {
    return { attempts, currentAttempt: BLANK_UUID, guesses: [], searches: [] };
  }

  const currentAttempt = last(attempts)?.uuid ?? BLANK_UUID;
  const guesses = await getIdbAttemptGuesses(currentAttempt);
  const searches = await getIdbAttemptSearches(currentAttempt);

  return { attempts, currentAttempt, guesses, searches };
};
