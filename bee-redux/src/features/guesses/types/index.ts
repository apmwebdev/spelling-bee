import { Uuid } from "@/types";

export type RailsGuessFormData = {
  guess: {
    uuid: Uuid;
    user_puzzle_attempt_uuid: Uuid;
    text: string;
    created_at: number;
    is_spoiled: boolean;
  };
};

export type RawGuessFormat = {
  uuid: Uuid;
  attemptUuid: Uuid;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
};

export type GuessFormat = {
  uuid: Uuid;
  attemptUuid: Uuid;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
  isAnswer: boolean;
  isExcluded: boolean;
};
