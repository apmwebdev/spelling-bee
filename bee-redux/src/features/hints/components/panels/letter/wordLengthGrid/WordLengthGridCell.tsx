import { LetterHintDataCell } from "@/features/hints/components/panels/LetterHintPanel";
import { StatusTrackingKeys, StatusTrackingOptions } from "@/features/hints";
import uniqid from "uniqid";

interface WordLengthGridCellProps {
  cell: LetterHintDataCell;
  isTotalRow: boolean;
  isTotalColumn: boolean;
  statusTracking: StatusTrackingKeys;
  getTdClasses: Function;
}

export function WordLengthGridCell({
  cell,
  isTotalRow,
  isTotalColumn,
  statusTracking,
  getTdClasses,
}: WordLengthGridCellProps) {
  const found = cell.guesses;
  const total = cell.answers;
  const remaining = total - found;

  const tdClasses = getTdClasses(cell, isTotalRow, isTotalColumn);
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
