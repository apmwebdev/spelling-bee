export interface AddDebouncePayload {
  key: string;
  delay: number;
  callback: Function;
}

interface debounceState {
  [key: string]: number;
}

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
