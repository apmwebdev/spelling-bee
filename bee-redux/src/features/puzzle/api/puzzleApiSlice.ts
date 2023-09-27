import { apiSlice } from "@/features/api";
import { calculateScore } from "@/util";
import { sortBy } from "lodash";

export type Rank = {
  id: string;
  name: string;
  multiplier: number;
  rank: number;
  score: number;
};

export type RanksType = [
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

export const Ranks: RanksType = [
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

export type AnswerFormat = {
  word: string;
  frequency: number;
  definitions: string[];
};

export type PuzzleFormatRaw = {
  id: number;
  date: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  pangrams: string[];
  perfectPangrams: string[];
  answers: AnswerFormat[];
  excludedWords: string[];
  isLatest: boolean;
};

export type PuzzleFormat = PuzzleFormatRaw & {
  shuffledOuterLetters: string[];
  answerWords: string[];
  totalPoints: number;
  answerLengths: number[];
  ranks: RanksType | [Rank];
};

export const BlankPuzzle: PuzzleFormat = {
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

export const puzzleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPuzzle: builder.query<PuzzleFormat, string>({
      query: (identifier: string) => ({
        url: `/puzzles/${identifier}`,
      }),
      transformResponse: (response: PuzzleFormatRaw) => {
        const answerWords = response.answers.map((answer) => answer.word);
        const answerLengths = (answerWords: string[]) => {
          const returnArray: number[] = [];
          for (const answer of answerWords) {
            if (!returnArray.includes(answer.length)) {
              returnArray.push(answer.length);
            }
          }
          return sortBy(returnArray);
        };
        const totalPoints = calculateScore(answerWords);

        const processedResponse: PuzzleFormat = {
          ...response,
          shuffledOuterLetters: [...response.outerLetters],
          answerWords,
          totalPoints,
          answerLengths: answerLengths(answerWords),
          ranks: Ranks.map(
            (rank): Rank => ({
              ...rank,
              score: Math.round(rank.multiplier * totalPoints),
            }),
          ) as RanksType,
        };
        return processedResponse;
      },
    }),
  }),
});

export const { useGetPuzzleQuery } = puzzleApiSlice;
