/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
