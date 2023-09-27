import {
  GridRow,
  PanelTypes,
  StatusTrackingKeys,
  SubstringHintDataCell,
  SubstringHintOutputKeys,
} from "@/features/hintPanels";
import { EnumeratedOptions } from "@/types";

/**
 * For letter panels, should it reveal letters at the start of the word or the end?
 * E.g., first letter, last two letters, etc.
 * @enum {string}
 * @prop Start "start"
 * @prop End "end"
 */
export enum LetterPanelLocationKeys {
  Start = "start",
  End = "end",
}

export const LetterPanelLocationOptions: EnumeratedOptions = {
  start: { title: "Start of Word" },
  end: { title: "End of Word" },
};
export type LetterPanelFormData = {
  location: LetterPanelLocationKeys;
  outputType: SubstringHintOutputKeys;
  /** How many letters to reveal */
  numberOfLetters: number;
  /**
   * How many letters "in" from the start/end of the word should it start revealing
   * letters? E.g., with a location == "start", numberOfLetters == 1, and
   * offset == 1, it would reveal the second letter of each answer instead of the
   * first.
   */
  lettersOffset: number;
  /** Whether to show rows that consist only of known words */
  hideKnown: boolean;
};
export type LetterPanelData = LetterPanelFormData & {
  panelType: PanelTypes;
};

export function isLetterPanelData(a: any): a is LetterPanelData {
  return a.panelType === PanelTypes.Letter;
}

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
