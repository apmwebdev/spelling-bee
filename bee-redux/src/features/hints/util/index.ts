import { StatusTrackingKeys, SubstringHintDataCell } from "@/features/hints";
import { composeClasses } from "@/utils";

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
    return composeClasses(baseClasses, "hint-completed");
  }
  if (cell.guesses === 0) {
    return composeClasses(baseClasses, "hint-not-started");
  }
  return composeClasses(baseClasses, "hint-in-progress");
};
