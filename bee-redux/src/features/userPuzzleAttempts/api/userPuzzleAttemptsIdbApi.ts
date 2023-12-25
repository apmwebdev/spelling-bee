/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { idb, idbInsertWithRetry } from "@/lib/idb";
import { isUuid, Uuid } from "@/types";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts";
import { UuidUpdateData } from "@/features/api/types";
import { devLog } from "@/util";

export const getIdbPuzzleAttempts = (puzzleId: number) => {
  return idb.attempts.where("puzzleId").equals(puzzleId).toArray();
};

/** If successful, returns the UUID of the inserted record. If unsuccessful, returns null. */
export const addIdbAttempt = idbInsertWithRetry<UserPuzzleAttempt>(
  idb.attempts.add.bind(idb.attempts),
);

/** This is for adding attempts that exist on the server but not in IDB, which could happen if a
 * user is logged into the app in more than one place. There is no reason to bulk add attempts that
 * are created through the current front end.
 * @param attempts
 */
export const bulkAddIdbAttempts = async (
  attempts: Array<UserPuzzleAttempt>,
) => {
  //TODO: At some point, make this use the bulk add functionality. I'm not using it now because the
  // documentation is not super clear what is returned with errors, which is important, so I'm
  // looping over and attempting to save them one at a time instead.
  const newUuids: Array<UuidUpdateData> = [];
  for (const attempt of attempts) {
    const uuid = attempt.uuid;
    const result = await addIdbAttempt(attempt);
    if (isUuid(result) && result !== uuid) {
      newUuids.push({
        oldUuid: uuid,
        newUuid: result,
      });
    }
  }
  return newUuids;
};

export const deleteIdbAttempt = (attemptUuid: Uuid) => {
  return idb.attempts.delete(attemptUuid);
};

/** Similar to the bulkAddIdbAttempts function above, this is for keeping IDB in sync with the
 * server, not for normal user operation. If there are conflicting records between the server and
 * IDB, the server takes precedence, and any conflicting IDB records should be deleted and replaced.
 * This method is for doing the deletion portion of that.
 * @param uuids
 */
export const bulkDeleteIdbAttempts = (uuids: Array<Uuid>) => {
  return idb.attempts.bulkDelete(uuids);
};

export const updateIdbAttemptUuids = async (uuids: Array<UuidUpdateData>) => {
  //TODO: Check if UUIDs change and add them to newUuids
  const newUuids: Array<UuidUpdateData> = [];
  for (const item of uuids) {
    try {
      await idb.attempts.update(item.oldUuid, { uuid: item.newUuid });
    } catch (err) {
      devLog("Error:", err);
    }
  }
  return newUuids;
};
