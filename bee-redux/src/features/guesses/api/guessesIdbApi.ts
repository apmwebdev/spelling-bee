import { idb, idbInsertWithRetry } from "@/lib/idb";
import { GuessFormat } from "@/features/guesses";
import { Uuid } from "@/types";

export const getIdbAttemptGuesses = (attemptUuid: Uuid) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = idbInsertWithRetry<GuessFormat>(idb.guesses.add);

export const deleteIdbGuess = (uuid: Uuid) => {
  return idb.guesses.delete(uuid);
};
