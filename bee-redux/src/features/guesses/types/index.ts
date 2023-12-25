import { hasAllProperties, isUuid, Uuid } from "@/types";

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

export type RawGuessFormat = {
  uuid: Uuid;
  attemptUuid: Uuid;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
};

//If updating, update GuessProperties as well
export type GuessFormat = {
  uuid: Uuid;
  attemptUuid: Uuid;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
  isAnswer: boolean;
  isExcluded: boolean;
};

export const GuessProperties = [
  "uuid",
  "attemptUuid",
  "text",
  "createdAt",
  "isSpoiled",
  "isAnswer",
  "isExcluded",
];

export const isGuess = (toTest: any): toTest is GuessFormat => {
  if (!hasAllProperties(toTest, GuessProperties)) return false;
  if (!isUuid(toTest.uuid)) return false;
  if (!isUuid(toTest.attemptUuid)) return false;
  if (!(typeof toTest.text === "string")) return false;
  if (!(typeof toTest.createdAt === "number")) return false;
  if (!(typeof toTest.isSpoiled === "boolean")) return false;
  if (!(typeof toTest.isAnswer === "boolean")) return false;
  if (!(typeof toTest.isExcluded === "boolean")) return false;
  return true;
};
