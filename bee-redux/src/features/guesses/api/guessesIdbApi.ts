import { idb } from "@/lib/idb";
import { GuessFormat } from "@/features/guesses";
import { Uuid } from "@/types";

export const getIdbAttemptGuesses = (attemptUuid: Uuid) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = (guess: GuessFormat) => {
  return idb.guesses.add(guess);
};

export const deleteIdbGuess = (uuid: Uuid) => {
  return idb.guesses.delete(uuid);
};
