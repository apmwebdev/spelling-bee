import {
  StatusTrackingKeys,
  StatusTrackingOptions,
  SubstringHintDataCell,
} from "@/features/hints";
import uniqid from "uniqid";
import { getTdClasses } from "@/features/hints/components/panels/letter/util";

interface WordLengthGridCellProps {
  cell: SubstringHintDataCell;
  isTotalRow: boolean;
  isTotalColumn: boolean;
  statusTracking: StatusTrackingKeys;
}

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
