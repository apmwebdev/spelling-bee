import Dexie, { DexieError, IndexableType, Table } from "dexie";
import { GuessFormat } from "@/features/guesses";
import { AttemptFormat } from "@/features/userPuzzleAttempts/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { HintProfileData } from "@/features/hintProfiles";
import { HintPanelData } from "@/features/hintPanels";
import * as crypto from "crypto";
import { Uuid } from "@/types";

export class SsbDexie extends Dexie {
  attempts!: Table<AttemptFormat>;
  guesses!: Table<GuessFormat>;
  hintProfiles!: Table<HintProfileData>;
  hintPanels!: Table<HintPanelData>;
  searchPanelSearches!: Table<SearchPanelSearchData>;

  constructor() {
    super("ssb");
    this.version(1).stores({
      attempts: "&uuid, puzzleId",
      hintProfiles: "&[type+uuid]",
      hintPanels: "&uuid, [hintProfileType+hintProfileUuid]",
      guesses: "&uuid, attemptUuid, &[text+attemptUuid]",
      searchPanelSearches: "&uuid, attemptUuid, searchPanelUuid",
    });
  }
}

export const idb = new SsbDexie();

export const isDexieError = (err: any): err is DexieError => {
  if (!("name" in err)) return false;
  if (!(typeof err.name === "string")) return false;
  if (!("message" in err)) return false;
  if (!(typeof err.message === "string")) return false;
  return true;
};

/** The maximum number of times the app should re-attempt to save a record in
 * IndexedDB if it fails the first time due to a ConstraintError.
 * @see idbInsertWithRetry
 */
export const MAX_IDB_RETRIES = 3;

/** An abstraction for use as the base of a generic type. It represents all
 * types that contain a UUID, which is most of them. This abstraction is only
 * useful for idbInsertWithRetry.
 * @see idbInsertWithRetry
 */
export type UuidRecord = { uuid: Uuid };

/** Takes a function for inserting a record into IndexedDB ("insertFn") and
 * returns that function wrapped with retry logic ("retryableInsertFn"). This
 * retryable function will automatically retry the insertion of a record if it
 * fails due to a "ConstraintError." This is important for, among other things,
 * regenerating a UUID and attempting to save the record again in the VERY
 * unlikely event that a duplicate UUID is generated.
 * @param {Function} insertFn
 * @see https://dexie.org/docs/DexieErrors/Dexie.ConstraintError
 */
export const idbInsertWithRetry = <T extends UuidRecord>(
  insertFn: Function,
) => {
  const retryableInsertFn = async (
    record: T,
    retryCount: number = 0,
  ): Promise<IndexableType | null> => {
    try {
      return await insertFn(record);
    } catch (err) {
      if (
        isDexieError(err) &&
        err.name === "ConstraintError" &&
        retryCount < MAX_IDB_RETRIES
      ) {
        record.uuid = crypto.randomUUID();
        return retryableInsertFn(record, retryCount + 1);
      }
      console.error("Error saving record:", record, err);
      return null;
    }
  };
  return retryableInsertFn;
};
