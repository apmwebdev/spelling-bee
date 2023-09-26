import {
  DefinitionPanelData,
  DefinitionPanelFormData,
  EnumeratedOptions,
  LetterPanelData,
  LetterPanelFormData,
  LetterPanelLocationKeys,
  ObscurityPanelData,
  ObscurityPanelFormData,
  PanelSubTypeTypes,
  SearchPanelBaseData,
  SearchPanelData,
  SearchPanelLocationKeys,
  SortOrderKeys,
  SubstringHintDataCell,
  SubstringHintOutputKeys,
} from "@/features/hints";

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
export type StatusTrackingOption = {
  title: string;
  compactTitle: string;
  outputFn: (cell: SubstringHintDataCell) => string;
};

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
export type PanelDisplayState = {
  isExpanded: boolean;
  isBlurred: boolean;
  isSticky: boolean;
  isSettingsExpanded: boolean;
  isSettingsSticky: boolean;
};

export type PanelDisplayFormData = {
  isExpanded?: boolean;
  isBlurred?: boolean;
  isSticky?: boolean;
  isSettingsExpanded?: boolean;
  isSettingsSticky?: boolean;
};

export type RailsPanelDisplayFormData = {
  is_expanded?: boolean;
  is_blurred?: boolean;
  is_sticky?: boolean;
  is_settings_expanded?: boolean;
  is_settings_sticky?: boolean;
};

export enum PanelDisplayStateKeys {
  isExpanded = "isExpanded",
  isBlurred = "isBlurred",
  isSticky = "isSticky",
  isSettingsExpanded = "isSettingsExpanded",
  isSettingsSticky = "isSettingsSticky",
}

export type HintPanelData = {
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
};

export type HintPanelCreateForm = {
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
};

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

export type HintPanelUpdateForm = {
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
};

export type RailsHintPanelUpdateForm = {
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
};

export type MoveHintPanelData = {
  id: number;
  oldIndex: number;
  newIndex: number;
};
