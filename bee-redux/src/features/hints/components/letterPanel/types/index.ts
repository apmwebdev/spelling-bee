import {
  GridRow,
  LetterPanelLocationKeys,
  SubstringHintDataCell,
} from "@/features/hints";
import { StatusTrackingKeys } from "@/features/hintPanels/types";

export interface LetterHintSubsectionProps {
  answers: string[];
  knownWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocationKeys;
  lettersOffset: number;
  hideKnown: boolean;
  statusTracking: StatusTrackingKeys;
}

export interface GridRows {
  [substring: string]: GridRow;
}

export interface TotalColumn {
  [substring: string]: SubstringHintDataCell;
}

export interface GridData {
  gridRows: GridRows;
  totalRow: GridRow;
  totalColumn: TotalColumn;
  grandTotal: SubstringHintDataCell;
  relevantAnswerLengths: number[];
  excludedAnswers: number;
}
