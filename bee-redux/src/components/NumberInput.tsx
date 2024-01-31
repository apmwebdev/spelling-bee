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
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import classNames from "classnames/dedupe";
import { devLog, trimZeroes } from "@/util";

export function NumberInput(
  props: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "min" | "max"
  > & {
    value: number;
    updateFn: (val: number) => void;
    min?: number;
    max?: number;
  },
) {
  const { className, type, updateFn, min, max, value, ...inputProps } = props;
  const { disabled } = inputProps;
  const [uiVal, setUiVal] = useState<number | string>(0);

  useEffect(() => {
    setUiVal(Number(value));
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    devLog("inputVal:", inputVal, "uiVal:", uiVal, "value:", value);
    if (inputVal === "") return setUiVal(inputVal);

    const numVal = Number(inputVal);
    if (isNaN(numVal)) return;

    if (numVal === value && uiVal !== value) return setUiVal(inputVal);

    if (inputVal.length > 1 && inputVal.charAt(0) === "0") {
      setUiVal(trimZeroes(inputVal));
    }

    if (min !== undefined && numVal < min) return;
    if (max !== undefined && numVal > max) return;
    updateFn(numVal);
  };

  const handleIncrement = () => {
    if (max !== undefined && value >= max) return;
    updateFn(Number(value) + 1);
  };

  const handleDecrement = () => {
    if (min !== undefined && value < min) return;
    updateFn(value - 1);
  };

  const handleBlur = () => {
    if (uiVal === value) return;
    setUiVal(value);
  };

  return (
    <div className="NumberInput">
      <button
        type="button"
        className="NumberInput_button NumberInput_decrementButton"
        onClick={handleDecrement}
        disabled={disabled || Number(value) <= Number(min)}
      >
        -
      </button>
      <input
        type="number"
        value={uiVal}
        className={classNames("NumberInput_input", className)}
        onChange={handleChange}
        onBlur={handleBlur}
        {...inputProps}
      />
      <button
        type="button"
        className="NumberInput_button NumberInput_incrementButton"
        onClick={handleIncrement}
        disabled={disabled || Number(value) >= Number(max)}
      >
        +
      </button>
    </div>
  );
}
