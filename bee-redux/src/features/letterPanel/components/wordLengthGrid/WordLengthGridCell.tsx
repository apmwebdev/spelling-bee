/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import uniqid from "uniqid";
import { getTdClasses } from "@/features/letterPanel";
import {
  StatusTrackingKeys,
  StatusTrackingOptions,
  SubstringHintDataCell,
} from "@/features/hintPanels";

type WordLengthGridCellProps = {
  cell: SubstringHintDataCell;
  isTotalRow: boolean;
  isTotalColumn: boolean;
  statusTracking: StatusTrackingKeys;
};

export function WordLengthGridCell({
  cell,
  isTotalRow,
  isTotalColumn,
  statusTracking,
}: WordLengthGridCellProps) {
  const tdClasses = getTdClasses(
    cell,
    isTotalRow,
    isTotalColumn,
    statusTracking,
  );

  if (cell.answers === 0) {
    return <td key={uniqid()} className={tdClasses}></td>;
  }

  return (
    <td key={uniqid()} className={tdClasses}>
      {StatusTrackingOptions[statusTracking].outputFn(cell)}
    </td>
  );
}
