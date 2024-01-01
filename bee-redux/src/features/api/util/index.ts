/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  DataSourceKeys,
  DiffContainer,
  ResolvedDataContainer,
  UuidRecord,
} from "@/features/api/types";
import { devLog } from "@/util";
import { Uuid } from "@/types";
import { isEqual } from "lodash";

export * from "./debouncer";
export * from "./persistor";

export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

type AnyObject = {
  [key: string | number | symbol]: any;
};

const isPlainObject = (thing: any) => thing?.constructor === Object;

export const keysToSnakeCase = (obj?: AnyObject) => {
  if (obj === undefined) return obj;
  const newObject: AnyObject = {};
  for (const key in obj) {
    const newKey = toSnakeCase(key);
    newObject[newKey] = isPlainObject(obj[key])
      ? keysToSnakeCase(obj[key])
      : obj[key];
  }
  return newObject;
};

/** Combines server data and IndexedDB data for a given type of record ("DataType"). The data to
 * compare comes in the form of a DiffContainer with two arrays of DataType. In the case of a
 * conflict, data from `primaryDataKey` (either "idbData" or "serverData") takes precedence.
 * Duplicates are removed by comparing UUID and any of the values for keys specified in the
 * uniqueKeys array.
 * Eventually, this function can probably be greatly simplified by using (currently experimental)
 * methods for Sets like `.union()`.
 * @param data The data from IndexedDB and the server to compare
 * @param primaryDataKey Which data (IDB or server) is the source of truth
 * @param nonUuidUniqueKeys What fields in the records aside from UUID must be unique. For example,
 *   the "text" field of a guess must be unique.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
export const combineForDisplayAndSync = <DataType extends UuidRecord>({
  data,
  primaryDataKey,
  nonUuidUniqueKeys,
}: {
  data: DiffContainer<DataType>;
  primaryDataKey: DataSourceKeys;
  nonUuidUniqueKeys?: string[];
}): ResolvedDataContainer<DataType> => {
  /** The data that takes precedence in case there's a conflict between local and server data. This
   * should normally be server data, i.e., `data.serverData`. */
  const primaryData = data[primaryDataKey];
  /** The key for the secondary data, put into its own variable to make some of the logic below
   * more readable. */
  const secondaryDataKey =
    primaryDataKey === DataSourceKeys.idbData
      ? DataSourceKeys.serverData
      : DataSourceKeys.idbData;
  /** Whichever data can be overwritten in case there's a conflict between server and IndexedDB
   * data.This should normally be the IndexedDB data, i.e., `data.idbData`. */
  const secondaryData = data[secondaryDataKey];
  /** Container for the combined, deduplicated data, to be returned and stored in Redux state */
  const displayData: DataType[] = [];
  /** Another piece of the return data. Tracks any records that are missing from the server or
   * IndexedDB so that they can be added and the data stores kept in sync. The values from the maps
   * are eventually spread into arrays, but maps are used here for easier lookup by UUID. */
  const updateMaps = {
    [DataSourceKeys.idbData]: new Map<Uuid, DataType>(),
    [DataSourceKeys.serverData]: new Map<Uuid, DataType>(),
  } as const;
  /** Final piece of the return data: A list of UUIDs that should be deleted from the secondary
   * data store because they match a unique key from the primary data but aren't identical. Some
   * records may be replaced by records from the primary data. This is necessary if, e.g., a guess
   * for the word "foobar" is stored both locally and server-side, but for some reason the UUIDs
   * don't match up. In that case, delete the local one and use the server version. */
  const dataToDelete = new Set<Uuid>();
  nonUuidUniqueKeys ??= [];
  /** The nonUuidUniqueKeys, plus "uuid", in a Set to remove duplicates */
  const uniqueKeys = new Set([...nonUuidUniqueKeys, "uuid"]);
  /** Used to track UUIDs from primary data to make it easier for the secondary data to know what
   * records the primary data is missing. */
  const uuids = new Set<Uuid>();
  /** Loops through all unique keys of all primary records. The nested loop is necessary to find
   * records in the secondary data that partially match the primary data, but aren't identical, like
   * guesses of the same word with different UUIDs, which should be removed. */
  primaryDataLoop: for (const item of primaryData) {
    for (const uniqueKey of uniqueKeys) {
      if (!(uniqueKey in item)) {
        //TODO: Add better error handling
        devLog(`Key ${uniqueKey} not present in item.`, item, data);
        continue primaryDataLoop;
      }
      const matchingItem = secondaryData.find(
        (otherItem) => otherItem[uniqueKey] === item[uniqueKey],
      );
      //If the secondary data store doesn't have the item, add it
      if (!matchingItem && !updateMaps[secondaryDataKey].has(item.uuid)) {
        updateMaps[secondaryDataKey].set(item.uuid, item);
      }
      //If `matchingItem` isn't identical to `item`, mark it for deletion and replace it with `item`
      if (matchingItem && !isEqual(item, matchingItem)) {
        dataToDelete.add(matchingItem.uuid);
        if (!updateMaps[secondaryDataKey].has(item.uuid)) {
          updateMaps[secondaryDataKey].set(item.uuid, item);
        }
      }
    }
    displayData.push(item);
    uuids.add(item.uuid);
  }
  /* Mark any records present in secondary data but missing in primary data to be added to primary
   * data. Since partial matches were already addressed in `primaryDataLoop`, this logic can be
   * much simpler. */
  for (const item of secondaryData) {
    devLog("secondary data item:", item);
    if (dataToDelete.has(item.uuid)) continue;
    if (!uuids.has(item.uuid)) {
      devLog("Don't delete item, item not present in primary data");
      displayData.push(item);
      updateMaps[primaryDataKey].set(item.uuid, item);
    }
  }
  return {
    displayData,
    idbDataToAdd: [...updateMaps[DataSourceKeys.idbData].values()],
    serverDataToAdd: [...updateMaps[DataSourceKeys.serverData].values()],
    dataToDelete: [...dataToDelete.values()],
  };
};
