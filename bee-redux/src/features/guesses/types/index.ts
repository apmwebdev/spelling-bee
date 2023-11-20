export type RawAttemptFormat = {
  uuid: string;
  puzzleId: number;
  createdAt: number;
  guesses: RawGuessFormat[];
};

export type AttemptFormat = {
  uuid: string;
  puzzleId: number;
  createdAt: number;
  guesses: GuessFormat[];
};

export type RailsGuessFormData = {
  guess: {
    uuid: string;
    user_puzzle_attempt_uuid: string;
    text: string;
    created_at: number;
    is_spoiled: boolean;
  };
};

export type RawGuessFormat = {
  uuid: string;
  attemptUuid: string;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
};

export type GuessFormat = {
  uuid: string;
  attemptUuid: string;
  text: string;
  createdAt: number;
  isSpoiled: boolean;
  isAnswer: boolean;
  isExcluded: boolean;
};
