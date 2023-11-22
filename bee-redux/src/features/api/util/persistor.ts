/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

/**
 * So that you can see the actual JSON.stringified string that was saved to
 * localStorage as well as what it was JSON.parsed into.
 */

type LoadedValue<T> = {
  saved: string;
  parsed: T;
};

const save = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(
      `Couldn't persist ${key} with ${value} to localStorage:`,
      err,
    );
    return false;
  }
};

const load = <T>(key: string): LoadedValue<T> | null => {
  const storedItem = localStorage.getItem(key);
  if (storedItem) {
    try {
      const loadedVal: LoadedValue<T> = {
        saved: storedItem,
        parsed: JSON.parse(storedItem),
      };
      return loadedVal;
    } catch (err) {
      console.error(`Couldn't parse localStorage item '${key}':`, err);
    }
  }
  return null;
};

const remove = (key: string) => {
  localStorage.removeItem(key);
};

export const persistor = { save, load, remove };
