import { idb } from "@/lib/idb";
import { GuessFormat } from "@/features/guesses";

export const getIdbAttemptGuesses = (attemptUuid: string) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = (guess: GuessFormat) => {
  return idb.guesses.add(guess);
};

export const deleteIdbGuess = (uuid: string) => {
  return idb.guesses.delete(uuid);
};
