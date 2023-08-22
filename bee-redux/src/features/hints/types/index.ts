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
export enum StatusTrackingOptions {
  /** Shows "{Found answer count} / {Total answer count}" */
  FoundOfTotal = "found_of_total",
  /** Shows "{Remaining answer count} / {Total answer count}" */
  RemainingOfTotal = "remaining_of_total",
  Found = "found",
  Remaining = "remaining",
  /** Shows total answer count only, i.e., no live updates */
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
/**
 * For letter panels, should it reveal letters at the start of the word or the end?
 * E.g., first letter, last two letters, etc.
 * @enum {string}
 * @prop Start "start"
 * @prop End "end"
 */
export enum LetterPanelLocations {
  Start = "start",
  End = "end",
}

/**
 * Output types for letter and search panels, i.e., the "substring" hint types
 * @enum {string}
 * @prop WordLengthGrid "word_length_grid" - A table with letter combinations as
 *   rows and word lengths as columns, each cell showing the number of answers
 *   of a certain word length for a given letter combination.
 * @prop WordCountList "word_count_list" - A list of letter combinations and the
 *   number of answers for that letter combination.
 * @prop LettersList "letters_list" - A list of letter combinations, but no numbers.
 *   Essentially, it is just confirming that certain letter combinations exist
 *   among the answers.
 */
export enum SubstringHintOutputTypes {
  WordLengthGrid = "word_length_grid",
  WordCountList = "word_count_list",
  LettersList = "letters_list",
}

export interface LetterPanelFormData {
  location: LetterPanelLocations;
  outputType: SubstringHintOutputTypes;
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
  showKnown: boolean;
}

export interface LetterPanelData extends LetterPanelFormData {
  panelType: string;
}

export function isLetterPanelData(a: any): a is LetterPanelData {
  return a.panelType === PanelTypes.Letter;
}

/**
 * For search panels, should it search for the search string at the start,
 * end, or anywhere in the puzzle words?
 */
export enum SearchPanelLocations {
  Start = "start",
  End = "end",
  Anywhere = "anywhere",
}

export interface SearchPanelFormData {
  location: SearchPanelLocations;
  lettersOffset: number;
  outputType: SubstringHintOutputTypes;
}

export interface SearchPanelData extends SearchPanelFormData {
  panelType: string;
  // ID is necessary for search panels so that searches know which panel they
  // belong to
  id: number;
}

export interface SearchPanelSearch extends SearchPanelData {
  attemptId: number;
  searchPanelId: number;
  searchString: string;
  createdAt: string;
}

export function isSearchPanelData(a: any): a is SearchPanelData {
  return a.panelType === PanelTypes.Search;
}

export interface ObscurityPanelFormData {
  showKnown: boolean;
  separateKnown: boolean;
  revealFirstLetter: boolean;
  revealLength: boolean;
  clickToDefine: boolean;
  sortOrder: "asc" | "desc";
}

export interface ObscurityPanelData extends ObscurityPanelFormData {
  panelType: string;
}

export function isObscurityPanelData(a: any): a is ObscurityPanelData {
  return a.panelType === PanelTypes.Obscurity;
}

export interface DefinitionPanelFormData {
  showKnown: boolean;
  revealLength: boolean;
  showObscurity: boolean;
  sortOrder: "asc" | "desc";
}

export interface DefinitionPanelData extends DefinitionPanelFormData {
  panelType: string;
}

export function isDefinitionPanelData(a: any): a is DefinitionPanelData {
  return a.panelType === PanelTypes.Definition;
}

export interface HintPanelData {
  id: number;
  name: string;
  initialDisplayState: PanelDisplayState;
  currentDisplayState: PanelDisplayState;
  statusTracking: StatusTrackingOptions;
  panelTypeData:
    | LetterPanelData
    | SearchPanelData
    | ObscurityPanelData
    | DefinitionPanelData;
}

export enum HintProfileTypes {
  Default = "DefaultHintProfile",
  User = "UserHintProfile",
}

export interface HintProfileBasicData {
  id: number;
  type: HintProfileTypes;
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
  defaultPanelTracking: StatusTrackingOptions;
  /** The display state that newly created panels come in with */
  defaultPanelDisplayState: PanelDisplayState;
  panels: HintPanelData[];
}

export interface DefaultHintProfile extends HintProfileData {
  type: HintProfileTypes.Default;
  panels: HintPanelData[];
}

export interface HintProfilesData {
  userHintProfiles: UserHintProfileBasic[];
  defaultHintProfiles: DefaultHintProfile[];
}

export interface UserHintProfileForm {
  name: string;
  default_panel_tracking: StatusTrackingOptions;
  default_panel_display_state: PanelDisplayState;
  panels: HintPanelData[];
}

interface HintPanelCommonForm {
  name: string;
  initial_display_state: PanelDisplayState;
  current_display_state: PanelDisplayState;
  status_tracking: StatusTrackingOptions;
  panel_subtype:
    | LetterPanelFormData
    | SearchPanelFormData
    | ObscurityPanelFormData
    | DefinitionPanelFormData;
}

export interface HintPanelCreateForm extends HintPanelCommonForm {
  user_hint_profile_id: number;
  panel_subtype_type: PanelSubTypeTypes;
}

export interface HintPanelUpdateForm extends HintPanelCommonForm {
  id: number;
}

export enum ColorSchemes {
  Auto = "auto",
  Light = "light",
  Dark = "dark",
}

export const defaultCurrentHintProfile: HintProfileBasicData = {
  type: HintProfileTypes.Default,
  id: 1,
};

// If either current_hint_profile_type OR current_hint_profile_id is defined,
// they both must be defined. Current_hint_profile is a polymorphic
// association in Rails, so it requires both fields.
export type UserPrefsFormData =
  | {
      color_scheme?: ColorSchemes;
      current_hint_profile_type: HintProfileTypes;
      current_hint_profile_id: number;
    }
  | {
      color_scheme?: ColorSchemes;
      current_hint_profile_type: undefined;
      current_hint_profile_id: undefined;
    };

export interface UserPrefsData {
  colorScheme: ColorSchemes;
  currentHintProfile: HintProfileBasicData;
}

export interface UserBaseData {
  prefs: UserPrefsData;
  hintProfiles: HintProfilesData;
  currentUserHintProfile?: UserHintProfileComplete;
}
