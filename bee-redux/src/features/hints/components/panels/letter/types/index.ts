import { LetterPanelLocationKeys, StatusTrackingKeys } from "@/features/hints";

export interface LetterHintSubsectionProps {
  answers: string[];
  correctGuessWords: string[];
  numberOfLetters: number;
  location: LetterPanelLocationKeys;
  lettersOffset: number;
  showKnown: boolean;
  statusTracking: StatusTrackingKeys;
}

export interface LetterHintDataCell {
  answers: number;
  guesses: number;
}

export interface GridRow {
  [index: number]: LetterHintDataCell;
}
export interface GridRows {
  [substring: string]: GridRow;
}

export interface TotalColumn {
  [substring: string]: LetterHintDataCell;
}

export interface GridData {
  gridRows: GridRows;
  totalRow: GridRow;
  totalColumn: TotalColumn;
  grandTotal: LetterHintDataCell;
  relevantAnswerLengths: number[];
  excludedAnswers: number;
}
