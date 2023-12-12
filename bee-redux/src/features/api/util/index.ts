/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { DiffContainer, UuidRecord } from "@/features/api/types";
import { devLog } from "@/util";

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
 * conflict, data from `sourceOfTruth` takes precedence. Duplicates are removed by comparing UUID
 * and any of the values for keys specified in the uniqueKeys array.
 * @param data
 * @param sourceOfTruth
 * @param uniqueKeys
 */
export const combineUnique = <DataType extends UuidRecord>({
  data,
  sourceOfTruth,
  uniqueKeys,
}: {
  data: DiffContainer<Array<DataType>>;
  sourceOfTruth: "idbData" | "serverData";
  uniqueKeys?: Array<string>;
}): Array<DataType> => {
  //TODO: This only combines the data for display. The stores also need to be reconciled if they
  // contain different data
  const returnArr: Array<DataType> = [];
  const keyTrackers = new Map<string, Map<string, DataType>>();
  keyTrackers.set("uuid", new Map<string, DataType>());
  uniqueKeys?.forEach((key) => {
    keyTrackers.set(key, new Map<string, DataType>());
  });
  outerLoop: for (const item of data[sourceOfTruth]) {
    for (const [key, tracker] of keyTrackers) {
      if (!(key in item)) {
        devLog(`Key ${key} not present in item.`, item, data);
        continue outerLoop;
      }
      if (tracker.has(item[key])) {
        devLog(`Non-unique value for ${key}:`, item, tracker.get(key));
        continue outerLoop;
      }
      tracker.set(item[key], item);
      returnArr.push(item);
    }
  }
  const otherDataSource =
    sourceOfTruth === "idbData" ? "serverData" : "idbData";
  for (const item of data[otherDataSource]) {
    let shouldAdd = true;
    for (const [key, tracker] of keyTrackers) {
      if (!(key in item) || tracker.has(item[key])) {
        shouldAdd = false;
        break;
      }
    }
    if (shouldAdd) {
      returnArr.push(item);
    }
  }
  return returnArr;
};
