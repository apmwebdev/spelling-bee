import { SubstringHintDataCell } from "@/features/hints";
import { composeClasses } from "@/util";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

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
    return composeClasses(baseClasses, "HintCompleted");
  }
  if (cell.guesses === 0) {
    return composeClasses(baseClasses, "HintNotStarted");
  }
  return composeClasses(baseClasses, "HintInProgress");
};
