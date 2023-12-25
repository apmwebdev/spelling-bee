import { idb, idbInsertWithRetry } from "@/lib/idb";
import { GuessFormat } from "@/features/guesses";
import { isUuid, Uuid } from "@/types";
import { UuidUpdateData } from "@/features/api/types";
import { devLog } from "@/util";

export const getIdbAttemptGuesses = (attemptUuid: Uuid) => {
  return idb.guesses.where("attemptUuid").equals(attemptUuid).toArray();
};

export const addIdbGuess = idbInsertWithRetry<GuessFormat>(
  idb.guesses.add.bind(idb.guesses),
);
// export const addIdbGuess = (guess: GuessFormat) => idb.guesses.add(guess);

export const bulkAddIdbGuesses = async (guesses: GuessFormat[]) => {
  const newUuids: UuidUpdateData[] = [];
  for (const guess of guesses) {
    const uuid = guess.uuid;
    const result = await addIdbGuess(guess);
    if (isUuid(result) && result !== uuid) {
      newUuids.push({
        oldUuid: uuid,
        newUuid: result,
      });
    }
  }
  return newUuids;
};

export const deleteIdbGuess = (uuid: Uuid) => {
  return idb.guesses.delete(uuid);
};

export const bulkDeleteIdbGuesses = (uuids: Uuid[]) => {
  return idb.guesses.bulkDelete(uuids);
};

export const updateIdbGuessUuids = async (uuids: UuidUpdateData[]) => {
  const newUuids: UuidUpdateData[] = [];
  for (const item of uuids) {
    try {
      await idb.guesses.update(item.oldUuid, { uuid: item.newUuid });
    } catch (err) {
      devLog("Error:", err);
    }
  }
  return newUuids;
};
