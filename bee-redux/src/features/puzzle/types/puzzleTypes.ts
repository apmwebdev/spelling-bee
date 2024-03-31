/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export type BaseRank = {
  id: string;
  name: string;
  multiplier: number;
  level: number;
};

export const BASE_RANKS: BaseRank[] = [
  {
    id: "beginner",
    name: "Beginner",
    multiplier: 0,
    level: 1,
  },
  {
    id: "goodStart",
    name: "Good Start",
    multiplier: 0.02,
    level: 2,
  },
  {
    id: "movingUp",
    name: "Moving Up",
    multiplier: 0.05,
    level: 3,
  },
  {
    id: "good",
    name: "Good",
    multiplier: 0.08,
    level: 4,
  },
  {
    id: "solid",
    name: "Solid",
    multiplier: 0.15,
    level: 5,
  },
  {
    id: "nice",
    name: "Nice",
    multiplier: 0.25,
    level: 6,
  },
  {
    id: "great",
    name: "Great",
    multiplier: 0.4,
    level: 7,
  },
  {
    id: "amazing",
    name: "Amazing",
    multiplier: 0.5,
    level: 8,
  },
  {
    id: "genius",
    name: "Genius",
    multiplier: 0.7,
    level: 9,
  },
  {
    id: "queenBee",
    name: "Queen Bee",
    multiplier: 1,
    level: 10,
  },
];

export type PuzzleRank = {
  baseRank: BaseRank;
  pointThreshold: number;
};

export const BLANK_RANK: PuzzleRank = {
  baseRank: {
    id: "noPuzzle",
    name: "No puzzle",
    multiplier: 0,
    level: 0,
  },
  pointThreshold: 0,
};

export const generatePuzzleRanks = (totalPoints: number): PuzzleRank[] => {
  return BASE_RANKS.map((baseRank) => {
    return {
      baseRank,
      pointThreshold: Math.round(baseRank.multiplier * totalPoints),
    };
  });
};

export const getNextRank = (
  startingRank: PuzzleRank | undefined,
  ranks: PuzzleRank[],
) => {
  if (
    startingRank === undefined ||
    ranks.length === 0 ||
    startingRank.baseRank.multiplier === 1
  ) {
    return undefined;
  }
  return ranks.find(
    (rank) => rank.baseRank.level === startingRank.baseRank.level + 1,
  );
};

export type TAnswer = {
  text: string;
  frequency: number;
  definitions: string[];
  hint: string;
};

export type RawPuzzle = {
  id: number;
  date: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  pangrams: string[];
  perfectPangrams: string[];
  answers: TAnswer[];
  excludedWords: string[];
  isLatest: boolean;
};

export type TPuzzle = RawPuzzle & {
  answers: TAnswer[];
  shuffledOuterLetters: string[];
  answerWords: string[];
  totalPoints: number;
  answerLengths: number[];
  ranks: PuzzleRank[];
};

export const BlankPuzzle: TPuzzle = {
  id: 0,
  date: "00-00-0000",
  centerLetter: "_",
  outerLetters: ["_", "_", "_", "_", "_", "_"],
  shuffledOuterLetters: ["_", "_", "_", "_", "_", "_", "_"],
  validLetters: ["_", "_", "_", "_", "_", "_", "_"],
  pangrams: [],
  perfectPangrams: [],
  answers: [],
  excludedWords: [],
  isLatest: false,
  answerWords: [],
  totalPoints: 0,
  answerLengths: [],
  ranks: [],
};
