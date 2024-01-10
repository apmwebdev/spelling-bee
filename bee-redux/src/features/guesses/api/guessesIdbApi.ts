import {
  createBulkAddIdbDataFn,
  createIdbUuidUpdateFn,
  idb,
  idbInsertWithRetry,
} from "@/lib/idb";
import { TGuess } from "@/features/guesses";

import { Uuid } from "@/features/api";

export const getIdbAttemptGuesses = (attemptUuid: Uuid) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = idbInsertWithRetry<TGuess>(
  idb.guesses.add.bind(idb.guesses),
);
// export const addIdbGuess = (guess: TGuess) => idb.guesses.add(guess);

export const bulkAddIdbGuesses = createBulkAddIdbDataFn(addIdbGuess);

export const deleteIdbGuess = (uuid: Uuid) => {
  return idb.guesses.delete(uuid);
};

export const bulkDeleteIdbGuesses = (uuids: Uuid[]) => {
  return idb.guesses.bulkDelete(uuids);
};

export const updateIdbGuessUuids = createIdbUuidUpdateFn({
  idbTable: idb.guesses,
  addFn: addIdbGuess,
});
