import { LetterHintDataCell } from "@/features/hints/components/panels/LetterHintPanel";
import { StatusTrackingOptions } from "@/features/hints";
import uniqid from "uniqid";

interface WordLengthGridCellProps {
  cell: LetterHintDataCell;
  isTotalRow: boolean;
  isTotalColumn: boolean;
  statusTracking: StatusTrackingOptions;
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
  switch (statusTracking) {
    case StatusTrackingOptions.FoundOfTotal:
      return (
        <td key={uniqid()} className={tdClasses}>
          {found}/{total}
        </td>
      );
    case StatusTrackingOptions.RemainingOfTotal:
      return (
        <td key={uniqid()} className={tdClasses}>
          {remaining}/{total}
        </td>
      );
    case StatusTrackingOptions.Found:
      return (
        <td key={uniqid()} className={tdClasses}>
          {found}
        </td>
      );
    case StatusTrackingOptions.Remaining:
      return (
        <td key={uniqid()} className={tdClasses}>
          {remaining}
        </td>
      );
    case StatusTrackingOptions.Total:
      return (
        <td key={uniqid()} className={tdClasses}>
          {total}
        </td>
      );
  }
}
