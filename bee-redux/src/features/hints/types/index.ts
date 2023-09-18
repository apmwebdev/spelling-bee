interface EnumerableOption {
  title: string;
}

interface EnumeratedOptions {
  [key: string]: EnumerableOption;
}

/**
 * Determines how to live update hints when correct guesses are made.
 * The numbers being counted here are puzzle answers (number of found answers,
 * total answers, etc.)
 * - FoundOfTotal
 * - RemainingOfTotal
 * - Found
 * - Remaining
 * - Total
 * @enum {string}
 */
export interface StatusTrackingOption {
  title: string;
  compactTitle: string;
  outputFn: (cell: SubstringHintDataCell) => string;
}

type StatusTrackingOptionsData = {
  [key: string]: StatusTrackingOption;
};

export const StatusTrackingOptions: StatusTrackingOptionsData = {
  found_of_total: {
    title: "Found of Total",
    compactTitle: "Found / Total",
    outputFn: (cell) => {
      return `${cell.guesses}/${cell.answers}`;
    },
  },
  remaining_of_total: {
    title: "Remaining of Total",
    compactTitle: "Remaining / Total",
    outputFn: (cell) => {
      return `${cell.answers - cell.guesses}/${cell.answers}`;
    },
  },
  found: {
    title: "Found",
    compactTitle: "Found",
    outputFn: (cell) => cell.guesses + "",
  },
  remaining: {
    title: "Remaining",
    compactTitle: "Remaining",
    outputFn: (cell) => cell.answers - cell.guesses + "",
  },
  total: {
    title: "Total",
    compactTitle: "Total",
    outputFn: (cell) => cell.answers + "",
  },
};

export enum StatusTrackingKeys {
  FoundOfTotal = "found_of_total",
  RemainingOfTotal = "remaining_of_total",
  Found = "found",
  Remaining = "remaining",
  Total = "total",
}

/**
 * Determines the display state of a panel. Used in 3 places:
 * - Panel initialDisplayState: How the panel loads (persisted in DB)
 * - Panel currentDisplayState: Not persisted
 * - Profile defaultPanelDisplayState: The display state new panels are created
 *   with by default for a given user hint profile
 *
 * @prop {boolean} isExpanded Whether the panel as a whole is collapsed or expanded
 * @prop {boolean} isBlurred Whether the hint part of the panel is blurred or visible
 * @prop {boolean} isSticky Whether the panel loads with the last known
 *   configuration of isExpanded and isBlurred
 * @prop {boolean} isSettingsExpanded Whether the settings are expanded or collapsed
 * @prop {boolean} isSettingsSticky Whether the settings remember their last
 *   collapsed/expanded state
 */
export interface PanelDisplayState {
  isExpanded: boolean;
  isBlurred: boolean;
  isSticky: boolean;
  isSettingsExpanded: boolean;
  isSettingsSticky: boolean;
}

export interface PanelDisplayFormData {
  isExpanded?: boolean;
  isBlurred?: boolean;
  isSticky?: boolean;
  isSettingsExpanded?: boolean;
  isSettingsSticky?: boolean;
}

export interface RailsPanelDisplayFormData {
  is_expanded?: boolean;
  is_blurred?: boolean;
  is_sticky?: boolean;
  is_settings_expanded?: boolean;
  is_settings_sticky?: boolean;
}

export enum PanelDisplayStateKeys {
  isExpanded = "isExpanded",
  isBlurred = "isBlurred",
  isSticky = "isSticky",
  isSettingsExpanded = "isSettingsExpanded",
  isSettingsSticky = "isSettingsSticky",
}

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

export interface SubstringHintDataCell {
  answers: number;
  guesses: number;
}

export interface GridRow {
  [index: number]: SubstringHintDataCell;
}

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

export interface LetterPanelFormData {
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
}

export interface LetterPanelData extends LetterPanelFormData {
  panelType: PanelTypes;
}

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

export interface SearchPanelBaseData {
  searchString: string;
  location: SearchPanelLocationKeys;
  lettersOffset: number;
  outputType: SubstringHintOutputKeys;
}

export interface SearchPanelData extends SearchPanelBaseData {
  panelType: PanelTypes;
  // ID is necessary for search panels so that searches know which panel they
  // belong to
  id: number;
}

export interface SearchPanelSearchData extends SearchPanelBaseData {
  //includes searchString, location, lettersOffset, and outputType through inheritance
  attemptId: number;
  searchPanelId: number;
  createdAt: number;
  id?: number;
}

export function isSearchPanelData(a: any): a is SearchPanelData {
  return a.panelType === PanelTypes.Search;
}

export type SearchPanelSearchDeleteArgs = { id?: number; createdAt: number };

export enum SortOrderKeys {
  asc = "asc",
  desc = "desc",
}

export const SortOrderOptions: EnumeratedOptions = {
  asc: { title: "Ascending" },
  desc: { title: "Descending" },
};

export interface ObscurityPanelFormData {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  clickToDefine: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
}

export interface ObscurityPanelData extends ObscurityPanelFormData {
  panelType: PanelTypes;
}

export function isObscurityPanelData(a: any): a is ObscurityPanelData {
  return a.panelType === PanelTypes.Obscurity;
}

export interface DefinitionPanelFormData {
  hideKnown: boolean;
  revealedLetters: number;
  separateKnown: boolean;
  showObscurity: boolean;
  revealLength: boolean;
  sortOrder: SortOrderKeys;
}

/*
 * TODO:
 *  Some number of these:
 *  mode: 'clickToReveal' or 'dictionary'
 *   Either show one definition for each word or hide all until clicked
 *  Add way to track what definitions have been revealed
 */

export interface DefinitionPanelData extends DefinitionPanelFormData {
  panelType: PanelTypes;
}

export function isDefinitionPanelData(a: any): a is DefinitionPanelData {
  return a.panelType === PanelTypes.Definition;
}

export interface HintPanelData {
  id: number;
  name: string;
  displayIndex: number;
  initialDisplayState: PanelDisplayState;
  currentDisplayState: PanelDisplayState;
  statusTracking: StatusTrackingKeys;
  typeData:
    | LetterPanelData
    | SearchPanelData
    | ObscurityPanelData
    | DefinitionPanelData;
}

export interface HintPanelCreateForm {
  userHintProfileId: number;
  name: string;
  displayIndex: number;
  initialDisplayState: PanelDisplayState;
  currentDisplayState: PanelDisplayState;
  statusTracking: StatusTrackingKeys;
  panelSubtypeType: PanelSubTypeTypes;
  typeData:
    | LetterPanelFormData
    | SearchPanelBaseData
    | ObscurityPanelFormData
    | DefinitionPanelFormData;
}

export enum HintPanelBooleanKeys {
  hideKnown = "hideKnown",
  revealLength = "revealLength",
  separateKnown = "separateKnown",
  showObscurity = "showObscurity",
  clickToDefine = "clickToDefine",
}

export const HintPanelBooleanSettings: EnumeratedOptions = {
  hideKnown: { title: "Hide Known" },
  revealLength: { title: "Reveal Length" },
  separateKnown: { title: "Separate Known" },
  showObscurity: { title: "Show Obscurity" },
  clickToDefine: { title: "Click to Define" },
};

export interface HintPanelUpdateForm {
  id: number;
  /**
   * For setting a standardized key that can be accessed if you don't know whether
   * the user has already queued up a mutation for a particular panel field. That
   * way, a debounce can be set on a per-field basis rather than having to set a
   * debounce for the entire updateHintPanel query.
   */
  debounceField?: string;
  name?: string;
  displayIndex?: number;
  initialDisplayState?: PanelDisplayFormData;
  currentDisplayState?: PanelDisplayFormData;
  statusTracking?: StatusTrackingKeys;
  typeData?: {
    hideKnown?: boolean;
    revealLength?: boolean;
    showObscurity?: boolean;
    sortOrder?: SortOrderKeys;
    location?: SearchPanelLocationKeys | LetterPanelLocationKeys;
    outputType?: SubstringHintOutputKeys;
    numberOfLetters?: number;
    lettersOffset?: number;
    separateKnown?: boolean;
    revealedLetters?: number;
    clickToDefine?: boolean;
  };
}

export interface RailsHintPanelUpdateForm {
  hint_panel: {
    id: number;
    name?: string;
    display_index?: number;
    initial_display_state_attributes?: RailsPanelDisplayFormData;
    current_display_state_attributes?: RailsPanelDisplayFormData;
    status_tracking?: StatusTrackingKeys;
    panel_subtype_attributes?: {
      hide_known?: boolean;
      reveal_length?: boolean;
      show_obscurity?: boolean;
      sort_order?: SortOrderKeys;
      location?: SearchPanelLocationKeys;
      output_type?: SubstringHintOutputKeys;
      number_of_letters?: number;
      letters_offset?: number;
      separate_known?: boolean;
      revealed_letters?: number;
      click_to_define?: boolean;
    };
  };
}

export type MoveHintPanelData = {
  id: number;
  oldIndex: number;
  newIndex: number;
};

export enum HintProfileTypes {
  Default = "DefaultHintProfile",
  User = "UserHintProfile",
}

export interface HintProfileBasicData {
  type: HintProfileTypes;
  id: number;
}

export interface HintProfileData extends HintProfileBasicData {
  name: string;
}

/**
 * A user-created hint profile, as opposed to a default hint profile.
 */
export interface UserHintProfileBasic extends HintProfileData {
  type: HintProfileTypes.User;
}

export interface UserHintProfileComplete extends UserHintProfileBasic {
  /** The status tracking that newly created panels come in with */
  defaultPanelTracking: StatusTrackingKeys;
  /** The display state that newly created panels come in with */
  defaultPanelDisplayState: PanelDisplayState;
  panels: HintPanelData[];
}

export interface DefaultHintProfile extends HintProfileData {
  type: HintProfileTypes.Default;
  panels: HintPanelData[];
}

export type CompleteHintProfile = UserHintProfileComplete | DefaultHintProfile;

export interface HintProfilesData {
  userHintProfiles: UserHintProfileBasic[];
  defaultHintProfiles: DefaultHintProfile[];
}

export interface UserHintProfileForm {
  name: string;
  default_panel_tracking: StatusTrackingKeys;
  default_panel_display_state: PanelDisplayState;
  panels: HintPanelData[];
}

export interface CurrentHintProfileFormData {
  current_hint_profile_type: HintProfileTypes;
  current_hint_profile_id: number;
}

export const defaultCurrentHintProfile: HintProfileBasicData = {
  type: HintProfileTypes.Default,
  id: 1,
};
