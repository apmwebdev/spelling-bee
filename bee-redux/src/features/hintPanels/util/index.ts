import {
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hintPanels";
import { composeClasses } from "@/util";

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
    return composeClasses(baseClasses, "SuccessText");
  }
  if (cell.guesses === 0) {
    return composeClasses(baseClasses, "ErrorText");
  }
  return composeClasses(baseClasses, "WarningText");
};
