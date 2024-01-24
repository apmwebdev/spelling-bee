/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export type Rank = {
  id: string;
  name: string;
  multiplier: number;
  rank: number;
  score: number;
};

export type TRanks = [
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
  Rank,
];

export const BlankRank: Rank = {
  id: "noPuzzle",
  name: "No Puzzle",
  multiplier: 0,
  rank: 0,
  score: 0,
};

export const Ranks: TRanks = [
  {
    id: "beginner",
    name: "Beginner",
    multiplier: 0,
    rank: 1,
    score: 0,
  },
  {
    id: "goodStart",
    name: "Good Start",
    multiplier: 0.02,
    rank: 2,
    score: 0,
  },
  {
    id: "movingUp",
    name: "Moving Up",
    multiplier: 0.05,
    rank: 3,
    score: 0,
  },
  {
    id: "good",
    name: "Good",
    multiplier: 0.08,
    rank: 4,
    score: 0,
  },
  {
    id: "solid",
    name: "Solid",
    multiplier: 0.15,
    rank: 5,
    score: 0,
  },
  {
    id: "nice",
    name: "Nice",
    multiplier: 0.25,
    rank: 6,
    score: 0,
  },
  {
    id: "great",
    name: "Great",
    multiplier: 0.4,
    rank: 7,
    score: 0,
  },
  {
    id: "amazing",
    name: "Amazing",
    multiplier: 0.5,
    rank: 8,
    score: 0,
  },
  {
    id: "genius",
    name: "Genius",
    multiplier: 0.7,
    rank: 9,
    score: 0,
  },
  {
    id: "queenBee",
    name: "Queen Bee",
    multiplier: 1,
    rank: 10,
    score: 0,
  },
];

export type TAnswer = {
  word: string;
  frequency: number;
  definitions: string[];
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
  shuffledOuterLetters: string[];
  answerWords: string[];
  totalPoints: number;
  answerLengths: number[];
  ranks: TRanks | [Rank];
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
  ranks: [BlankRank],
};
