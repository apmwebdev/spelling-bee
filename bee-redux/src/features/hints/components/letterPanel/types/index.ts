import {
  GridRow,
  LetterPanelLocationKeys,
  SubstringHintDataCell,
} from "@/features/hints";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

export type LetterHintSubsectionProps = {
  answers: string[];
  knownWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocationKeys;
  lettersOffset: number;
  hideKnown: boolean;
  statusTracking: StatusTrackingKeys;
};

export type GridRows = {
  [substring: string]: GridRow;
};

export type TotalColumn = {
  [substring: string]: SubstringHintDataCell;
};

export type GridData = {
  gridRows: GridRows;
  totalRow: GridRow;
  totalColumn: TotalColumn;
  grandTotal: SubstringHintDataCell;
  relevantAnswerLengths: number[];
  excludedAnswers: number;
};
