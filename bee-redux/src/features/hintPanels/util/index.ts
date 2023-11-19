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
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hintPanels";
import classNames from "classnames/dedupe";

export const createSubstringHintDataCell = (): SubstringHintDataCell => {
  return { answers: 0, guesses: 0 };
};
export const getSubstringHintStatusClasses = ({
  baseClasses,
  cell,
  statusTracking,
}: {
  baseClasses: string;
  cell: SubstringHintDataCell;
  statusTracking: StatusTrackingKeys;
}) => {
  if (statusTracking === StatusTrackingKeys.Total) {
    return baseClasses;
  }
  if (cell.guesses === cell.answers) {
    return classNames(baseClasses, "SuccessText");
  }
  if (cell.guesses === 0) {
    return classNames(baseClasses, "ErrorText");
  }
  return classNames(baseClasses, "WarningText");
};
