import {
  createBulkAddIdbDataFn,
  createIdbUuidUpdateFn,
  idb,
  idbInsertWithRetry,
} from "@/lib/idb";
import { GuessFormat } from "@/features/guesses";
import { Uuid } from "@/types";

export const getIdbAttemptGuesses = (attemptUuid: Uuid) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = idbInsertWithRetry<GuessFormat>(
  idb.guesses.add.bind(idb.guesses),
);
// export const addIdbGuess = (guess: GuessFormat) => idb.guesses.add(guess);

export const bulkAddIdbGuesses = createBulkAddIdbDataFn(addIdbGuess);

export const deleteIdbGuess = (uuid: Uuid) => {
  return idb.guesses.delete(uuid);
};

export const bulkDeleteIdbGuesses = (uuids: Uuid[]) => {
  return idb.guesses.bulkDelete(uuids);
};

export const updateIdbGuessUuids = createIdbUuidUpdateFn(idb.guesses);
