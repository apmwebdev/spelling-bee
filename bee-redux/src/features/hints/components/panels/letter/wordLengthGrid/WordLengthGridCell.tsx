import { StatusTrackingKeys, StatusTrackingOptions } from "@/features/hints";
import uniqid from "uniqid";
import { getTdClasses } from "@/features/hints/components/panels/letter/util";
import { LetterHintDataCell } from "@/features/hints/components/panels/letter/types";

interface WordLengthGridCellProps {
  cell: LetterHintDataCell;
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
  const found = cell.guesses;
  const total = cell.answers;
  const remaining = total - found;
  const tdClasses = getTdClasses(
    cell,
    isTotalRow,
    isTotalColumn,
    statusTracking,
  );

  if (total === 0) {
    return <td key={uniqid()} className={tdClasses}></td>;
  }

  return (
    <td key={uniqid()} className={tdClasses}>
      {StatusTrackingOptions[statusTracking].outputFn({
        found,
        total,
        remaining,
      })}
    </td>
  );
}
