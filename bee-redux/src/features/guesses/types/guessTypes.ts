import {
  createTypeGuard,
  TypeGuardPropertyValidator,
} from "@/types/globalTypes";
import { isUuid, Uuid } from "@/features/api";

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

export const isGuess = createTypeGuard<GuessFormat>(
  new Map<string, TypeGuardPropertyValidator>([
    ["uuid", isUuid],
    ["attemptUuid", isUuid],
    ["text", "string"],
    ["createdAt", "number"],
    ["isSpoiled", "boolean"],
    ["isAnswer", "boolean"],
    ["isExcluded", "boolean"],
  ]),
);
