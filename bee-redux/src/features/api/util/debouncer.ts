/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

export type AddDebouncePayload = {
  key: string;
  delay: number;
  callback: Function;
};

type debounceState = {
  [key: string]: number;
};

const debouncerState: debounceState = {};

export const addDebouncer = ({ key, delay, callback }: AddDebouncePayload) => {
  const state = debouncerState;
  if (state[key]) {
    clearTimeout(state[key]);
  }
  state[key] = window.setTimeout(() => {
    callback();
    delete state[key];
  }, delay);
};
