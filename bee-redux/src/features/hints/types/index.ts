export type EnumerableOption = {
  title: string;
};

export type EnumeratedOptions = {
  [key: string]: EnumerableOption;
};

export enum PanelTypes {
  Letter = "letter",
  Search = "search",
  Obscurity = "obscurity",
  Definition = "definition",
}

export enum PanelSubTypeTypes {
  Letter = "LetterPanel",
  Search = "SearchPanel",
  Obscurity = "ObscurityPanel",
  Definition = "DefinitionPanel",
}

export type SubstringHintDataCell = {
  answers: number;
  guesses: number;
};

export type GridRow = {
  [index: number]: SubstringHintDataCell;
};

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

/**
 * Output types for letter and search panels, i.e., the "substring" hint types
 * @enum {string}
 * @prop WordLengthGrid "word_length_grid" - A table with letter combinations as
 *   rows and word lengths as columns, each cell showing the number of answers
 *   of a certain word length for a given letter combination.
 * @prop WordCountList "word_count_list" - A list of letter combinations and the
 *   number of answers for that letter combination.
 * @prop LettersPresent "letters_list" - A list of letter combinations, but no numbers.
 *   Essentially, it is just confirming that certain letter combinations exist
 *   among the answers.
 */
export enum SubstringHintOutputKeys {
  WordLengthGrid = "word_length_grid",
  WordCountList = "word_count_list",
  LettersPresent = "letters_list",
}

export const SubstringHintOutputOptions: EnumeratedOptions = {
  word_length_grid: { title: "Word Length Grid" },
  word_count_list: { title: "Word Count List" },
  letters_list: { title: "Letters Present?" },
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

/**
 * For search panels, should it search for the search string at the start,
 * end, or anywhere in the puzzle words?
 */
export enum SearchPanelLocationKeys {
  Start = "start",
  End = "end",
  Anywhere = "anywhere",
}

export const SearchPanelLocationOptions: EnumeratedOptions = {
  start: { title: "Start of Word" },
  end: { title: "End of Word" },
  anywhere: { title: "Anywhere in Word" },
};

export type SearchPanelBaseData = {
  searchString: string;
  location: SearchPanelLocationKeys;
  lettersOffset: number;
  outputType: SubstringHintOutputKeys;
};

export type SearchPanelData = SearchPanelBaseData & {
  panelType: PanelTypes;
  // ID is necessary for search panels so that searches know which panel they
  // belong to
  id: number;
};

export function isSearchPanelData(a: any): a is SearchPanelData {
  return a.panelType === PanelTypes.Search;
}

export enum SortOrderKeys {
  asc = "asc",
  desc = "desc",
}

export const SortOrderOptions: EnumeratedOptions = {
  asc: { title: "Ascending" },
  desc: { title: "Descending" },
};

export type ObscurityPanelFormData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  clickToDefine: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};

export type ObscurityPanelData = ObscurityPanelFormData & {
  panelType: PanelTypes;
};

export function isObscurityPanelData(a: any): a is ObscurityPanelData {
  return a.panelType === PanelTypes.Obscurity;
}

export type DefinitionPanelFormData = {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  showObscurity: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
};

export type DefinitionPanelData = DefinitionPanelFormData & {
  panelType: PanelTypes;
};

export function isDefinitionPanelData(a: any): a is DefinitionPanelData {
  return a.panelType === PanelTypes.Definition;
}
