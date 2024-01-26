/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { PuzzleRank, TAnswer } from "@/features/puzzle/types/puzzleTypes";

export type ProgressStatusSettings = {
  showTotalWords: boolean;
  showTotalPoints: boolean;
};

export type RankProgress = {
  currentRank: PuzzleRank;
  nextRank: PuzzleRank | undefined;
  pointsUntilNextRank: number | undefined;
};

/** Calculated data for use in the Progress status component. Each top level property has "Data" at
 * the end of the property name so that this can be destructured and each property will still be
 * clear.
 */
export type ProgressData = {
  answerData: {
    totalCount: number;
    foundCount: number;
    spoiledCount: number;
    knownCount: number;
    remainingCount: number;
  };
  scoreData: {
    current: number;
    total: number;
    spoiledPoints: number;
    maxAchievable: number;
  };
  percentageData: {
    pointsFound: number;
    pointsSpoiled: number;
    pointsAchievable: number;
  };
  rankData: RankProgress;
};

export type LetterAnswers = {
  known: TAnswer[];
  unknown: TAnswer[];
  all: TAnswer[];
};

export const createLetterAnswers = (): LetterAnswers => ({
  known: [],
  unknown: [],
  all: [],
});

export type AnswersByLetter = {
  [letter: string]: LetterAnswers;
};

export type AnswersByLetterSortable = {
  asc: AnswersByLetter;
  desc: AnswersByLetter;
};
