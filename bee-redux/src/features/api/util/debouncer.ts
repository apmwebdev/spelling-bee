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

type DebounceState = Map<string, number>;

const debouncerState: DebounceState = new Map<string, number>();

/** Runs a function after a delay. The function is identified with a key. If the same function is
 * added again while the first one is pending, the first one is overwritten. I.e. last call wins.
 */
export const debounce = ({ key, delay, callback }: AddDebouncePayload) => {
  const state = debouncerState;
  if (state.has(key)) {
    clearTimeout(state.get(key));
  }
  state.set(
    key,
    window.setTimeout(() => {
      callback();
      state.delete(key);
    }, delay),
  );
};

type ThrottleResult = {
  didRun: boolean;
  value?: any;
};

/** Runs a function immediately, and then sets a cooldown, identified by a key, during which the
 * same function cannot be run again. I.e., first call wins, opposite to debounce.
 */
export const throttle = ({
  key,
  delay,
  callback,
}: AddDebouncePayload): ThrottleResult => {
  const state = debouncerState;
  const throttleResult: ThrottleResult = { didRun: false };
  if (state.has(key)) return throttleResult;
  state.set(
    key,
    window.setTimeout(() => state.delete(key), delay),
  );
  return { didRun: true, value: callback() };
};
