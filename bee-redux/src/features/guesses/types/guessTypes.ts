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
