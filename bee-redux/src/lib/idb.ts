import Dexie, { DexieError, IndexableType, Table } from "dexie";
import { GuessFormat } from "@/features/guesses";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { HintProfileData } from "@/features/hintProfiles";
import { HintPanelData } from "@/features/hintPanels";
import * as crypto from "crypto";
import {
  isUuid,
  UuidRecord,
  UuidUpdateData,
} from "@/features/api/types/apiTypes";
import { devLog } from "@/util";

export class SsbDexie extends Dexie {
  attempts!: Table<UserPuzzleAttempt>;
  guesses!: Table<GuessFormat>;
  hintProfiles!: Table<HintProfileData>;
  hintPanels!: Table<HintPanelData>;
  searchPanelSearches!: Table<SearchPanelSearchData>;

  //TODO: Send updatedAt timestamp to front end for hint profiles and hint panels and index it here
  //TODO: Add functionality for deletion and updates offline
  constructor() {
    super("ssb");
    this.version(1).stores({
      attempts: "&uuid, puzzleId, createdAt",
      hintProfiles: "&[type+uuid]",
      hintPanels: "&uuid, [hintProfileType+hintProfileUuid]",
      guesses: "&uuid, attemptUuid, &[text+attemptUuid], createdAt",
      searchPanelSearches: "&uuid, attemptUuid, searchPanelUuid, createdAt",
    });
  }
}

export const idb = new SsbDexie();

/** A type representing all the different errors that can be returned by a Dexie promise.
 *  DexieError is a custom error type specific to Dexie. The others are standard JS errors.
 *  @see https://dexie.org/docs/DexieErrors/DexieError
 */
export type DexieGeneralError =
  | DexieError
  | SyntaxError
  | TypeError
  | RangeError;

/** Tests whether something is any of the errors that should be returnable by a Dexie promise.
 * @param err
 */
export const isDexieGeneralError = (err: any): err is DexieGeneralError => {
  return (
    err instanceof Dexie.DexieError ||
    err instanceof SyntaxError ||
    err instanceof TypeError ||
    err instanceof RangeError
  );
};

/** Slightly more convenient than writing `someValue instanceof Dexie.DexieError` everywhere. Not
 *  sure this type guard is needed since Dexie can return other errors besides its own custom
 *  ones and the type guard function for that is above.
 * @param err
 * @see isDexieGeneralError
 */
export const isDexieError = (err: any): err is DexieError => {
  return err instanceof Dexie.DexieError;
};

/** The maximum number of times the app should re-attempt to save a record in
 * IndexedDB if it fails the first time due to a ConstraintError.
 * @see idbInsertWithRetry
 */
export const MAX_IDB_RETRIES = 3;

/** Takes a function for inserting a record into IndexedDB ("insertFn") and
 * returns that function wrapped with retry logic ("retryableInsertFn"). This
 * retryable function will automatically retry the insertion of a record if it
 * fails due to a "ConstraintError." This is important for, among other things,
 * regenerating a UUID and attempting to save the record again in the VERY
 * unlikely event that a duplicate UUID is generated.
 * @param {Function} insertFn
 * @see https://dexie.org/docs/DexieErrors/Dexie.ConstraintError
 */
export const idbInsertWithRetry = <RecordType extends UuidRecord>(
  insertFn: Function,
) => {
  const retryableInsertFn = async (
    record: RecordType,
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
      // TODO: Add better error handling here
      console.error("Error saving record:", record, err);
      return null;
    }
  };
  return retryableInsertFn;
};

export const createIdbUuidUpdateFn =
  <DataType extends UuidRecord>(idbTable: Table<DataType, IndexableType>) =>
  async (uuids: UuidUpdateData[]) => {
    const newUuids: UuidUpdateData[] = [];
    for (const item of uuids) {
      try {
        await idbTable.update(item.oldUuid, { uuid: item.newUuid });
      } catch (err) {
        devLog("Error:", err);
      }
    }
    return newUuids;
  };

export type IdbAddFn<DataType> = (
  record: DataType,
  retryCount?: number,
) => Promise<IndexableType | null>;

export const createBulkAddIdbDataFn =
  <DataType extends UuidRecord>(addFn: IdbAddFn<DataType>) =>
  async (records: DataType[]) => {
    //TODO: Eventually use the bulk add functionality in Dexie for this. Need to figure out exactly
    // how errors are handled first though.
    const newUuids: UuidUpdateData[] = [];
    for (const record of records) {
      const uuid = record.uuid;
      const result = await addFn(record);
      if (isUuid(result) && result !== uuid) {
        newUuids.push({
          oldUuid: uuid,
          newUuid: result,
        });
      }
    }
    return newUuids;
  };
