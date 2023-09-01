import {
  GridRow,
  LetterPanelLocationKeys,
  StatusTrackingKeys,
  SubstringHintDataCell,
} from "@/features/hints";

export interface LetterHintSubsectionProps {
  answers: string[];
  correctGuessWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocationKeys;
  lettersOffset: number;
  showKnown: boolean;
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
