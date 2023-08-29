import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import cloneDeep from "lodash/cloneDeep";
import {
  isSearchPanelData,
  LetterPanelLocations,
  SearchPanelData,
  StatusTrackingKeys,
  // StatusTrackingKeys,
} from "./types";
// import { defaultProfiles } from "./hintProfilesAPI"

/**
 * For determining how to load the hint panel initially.
 * Expanded = fully expanded
 * Blurred = the hint controls are expanded, but the hints themselves are hidden
 * Collapsed = the hint panel is fully collapsed
 * Sticky = Remember the last state of the panel
 */
export enum PanelInitialDisplayOptions {
  Expanded = "EXPANDED",
  Blurred = "BLURRED",
  Collapsed = "COLLAPSED",
  CollapsedAndBlurred = "COLLAPSED_AND_BLURRED",
  Sticky = "STICKY",
}

export enum PanelTypes {
  Letter = "LETTER",
  Search = "SEARCH",
  WordObscurity = "WORD_OBSCURITY",
  Definitions = "DEFINITIONS",
}

export enum StringHintDisplayOptions {
  LettersOnly = "LETTERS_ONLY",
  WordCountList = "WORD_COUNT_LIST",
  WordLengthGrid = "WORD_LENGTH_GRID",
}

export interface LetterPanelSettings {
  numberOfLetters: number;
  locationInWord: LetterPanelLocations;
  offset: number;
  display: StringHintDisplayOptions;
}

export function isLetterPanelSettings(a: any): a is LetterPanelSettings {
  return a.numberOfLetters !== undefined;
}

export enum SearchPanelLocations {
  Beginning = "BEGINNING",
  End = "END",
  Anywhere = "ANYWHERE",
}

export interface SearchPanelSettings {
  searchLocation: SearchPanelLocations;
  offset: number;
  display: StringHintDisplayOptions;
}

export interface SearchPanelSearch extends SearchPanelSettings {
  searchId: number;
  searchString: string;
}

export function isSearchPanelSettings(a: any): a is SearchPanelSettings {
  return a.searchLocation !== undefined;
}

export interface WordObscurityPanelSettings {}

export interface DefinitionsPanelSettings {}

export interface HintPanelFormat {
  id: number;
  name: string;
  isCollapsed: boolean;
  settingsAreCollapsed: boolean;
  isBlurred: boolean;
  tracking: StatusTrackingKeys;
  initialDisplay: PanelInitialDisplayOptions;
  type: PanelTypes;
  typeSpecificData:
    | LetterPanelSettings
    | SearchPanelData
    | WordObscurityPanelSettings
    | DefinitionsPanelSettings;
}

export enum ProfileDisplayDefaults {
  Expanded = "EXPANDED",
  Blurred = "BLURRED",
  Collapsed = "COLLAPSED",
}

export interface HintProfileFormat {
  id: number;
  name: string;
  isUserCreated: boolean;
  displayDefault: ProfileDisplayDefaults;
  trackingDefault: StatusTrackingKeys;
  panels: HintPanelFormat[];
}

export const blankHintProfile: HintProfileFormat = {
  id: -1,
  name: "None",
  isUserCreated: false,
  displayDefault: ProfileDisplayDefaults.Expanded,
  trackingDefault: StatusTrackingKeys.RemainingOfTotal,
  panels: [],
};

export interface HintProfilesStateData {
  currentProfile: HintProfileFormat;
  profiles: HintProfileFormat[];
}

export interface HintProfilesState {
  data: HintProfilesStateData;
  status: string;
}

const superSpellingBeeProfile = (): HintProfileFormat => {
  return {
    id: 0,
    name: "Super Spelling Bee",
    isUserCreated: false,
    displayDefault: ProfileDisplayDefaults.Expanded,
    trackingDefault: StatusTrackingKeys.RemainingOfTotal,
    panels: [
      {
        id: 4,
        name: "String Search",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Search,
        typeSpecificData: {
          currentSettings: {
            searchLocation: SearchPanelLocations.Anywhere,
            offset: 0,
            display: StringHintDisplayOptions.LettersOnly,
          },
          searches: [
            {
              searchId: 0,
              searchString: "eem",
              searchLocation: SearchPanelLocations.Anywhere,
              offset: 0,
              display: StringHintDisplayOptions.WordLengthGrid,
            },
            {
              searchId: 1,
              searchString: "mot",
              searchLocation: SearchPanelLocations.Beginning,
              offset: 2,
              display: StringHintDisplayOptions.WordCountList,
            },
            {
              searchId: 2,
              searchString: "ed",
              searchLocation: SearchPanelLocations.End,
              offset: 1,
              display: StringHintDisplayOptions.WordCountList,
            },
            {
              searchId: 3,
              searchString: "met",
              searchLocation: SearchPanelLocations.Anywhere,
              offset: 0,
              display: StringHintDisplayOptions.LettersOnly,
            },
          ],
        },
      },
      {
        id: 1,
        name: "Answer Lengths x First Letter",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeSpecificData: {
          numberOfLetters: 1,
          locationInWord: LetterPanelLocations.Start,
          offset: 0,
          display: StringHintDisplayOptions.WordLengthGrid,
        },
      },
      {
        id: 2,
        name: "First Two Letters Word Count",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeSpecificData: {
          numberOfLetters: 2,
          locationInWord: LetterPanelLocations.Start,
          offset: 0,
          display: StringHintDisplayOptions.WordCountList,
        },
      },
      {
        id: 3,
        name: "Word Obscurity Ranking",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.WordObscurity,
        typeSpecificData: {},
      },
      {
        id: 5,
        name: "Definitions",
        isCollapsed: true,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Collapsed,
        type: PanelTypes.Definitions,
        typeSpecificData: {},
      },
    ],
  };
};

const spellingBeeBuddyProfile = (): HintProfileFormat => {
  return {
    id: 1,
    name: "NYT Spelling Bee Buddy",
    isUserCreated: false,
    displayDefault: ProfileDisplayDefaults.Blurred,
    trackingDefault: StatusTrackingKeys.Remaining,
    panels: [
      {
        id: 8,
        name: "Your Grid of Remaining Words",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.Remaining,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeSpecificData: {
          numberOfLetters: 1,
          locationInWord: LetterPanelLocations.Start,
          offset: 0,
          display: StringHintDisplayOptions.WordLengthGrid,
        },
      },
      {
        id: 9,
        name: "Your Two-Letter List",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: false,
        tracking: StatusTrackingKeys.Remaining,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeSpecificData: {
          numberOfLetters: 2,
          locationInWord: LetterPanelLocations.Start,
          offset: 0,
          display: StringHintDisplayOptions.WordCountList,
        },
      },
      {
        id: 10,
        name: "Word Obscurity Ranking",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: true,
        tracking: StatusTrackingKeys.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Blurred,
        type: PanelTypes.WordObscurity,
        typeSpecificData: {},
      },
      {
        id: 11,
        name: "Definitions",
        isCollapsed: false,
        settingsAreCollapsed: true,
        isBlurred: true,
        tracking: StatusTrackingKeys.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Blurred,
        type: PanelTypes.Definitions,
        typeSpecificData: {},
      },
    ],
  };
};

const initialState = (): HintProfilesState => {
  const ssbProfile = superSpellingBeeProfile();
  return {
    data: {
      currentProfile: ssbProfile,
      profiles: [ssbProfile, spellingBeeBuddyProfile()],
    },
    status: "stub",
  };
};

export interface ChangeProfilePayload {
  newId: number;
}

export interface ChangeLetterPanelNumberOfLettersPayload {
  panelId: number;
  newValue: number;
}

export interface ChangeLetterPanelLocationInWordPayload {
  panelId: number;
  newValue: LetterPanelLocations;
}

export interface ChangeLetterPanelOffsetPayload {
  panelId: number;
  newValue: number;
}

export interface ChangeLetterPanelDisplayPayload {
  panelId: number;
  newValue: StringHintDisplayOptions;
}

const findPanel = (state: HintProfilesState, panelId: number) => {
  return state.data.currentProfile.panels.find((panel) => {
    return panel.id === panelId;
  });
};

export const hintProfilesSlice = createSlice({
  name: "hintProfiles",
  initialState,
  reducers: {
    setCurrentProfile: (
      state,
      action: { payload: ChangeProfilePayload; type: string },
    ) => {
      const newCurrent = state.data.profiles.find(
        (profile) => profile.id === action.payload.newId,
      );
      if (newCurrent) {
        state.data.currentProfile = newCurrent;
      }
    },
    removePanel: (
      state,
      action: { payload: { panelId: number }; type: string },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      const panelIndex = state.data.currentProfile.panels.indexOf(panel);
      state.data.currentProfile.panels.splice(panelIndex, 1);
    },
    setIsCollapsed: (
      state,
      action: {
        payload: { panelId: number; isCollapsed: boolean };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      panel.isCollapsed = action.payload.isCollapsed;
    },
    duplicatePanel: (
      state,
      action: {
        payload: { panelId: number };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      const newPanel = cloneDeep(panel);
      newPanel.id = newPanel.id + 20;
      state.data.currentProfile.panels.push(newPanel);
    },
    setSettingsAreCollapsed: (
      state,
      action: {
        payload: { panelId: number; settingsAreCollapsed: boolean };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      panel.settingsAreCollapsed = action.payload.settingsAreCollapsed;
    },
    setTracking: (
      state,
      action: {
        payload: { panelId: number; tracking: StatusTrackingKeys };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      panel.tracking = action.payload.tracking;
    },
    setInitialDisplay: (
      state,
      action: {
        payload: {
          panelId: number;
          initialDisplay: PanelInitialDisplayOptions;
        };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel) {
        return;
      }
      panel.initialDisplay = action.payload.initialDisplay;
    },
    changeLetterPanelNumberOfLetters: (
      state,
      action: {
        payload: ChangeLetterPanelNumberOfLettersPayload;
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isLetterPanelSettings(panel.typeSpecificData)) {
        return;
      }
      panel.typeSpecificData.numberOfLetters = action.payload.newValue;
    },
    changeLetterPanelLocationInWord: (
      state,
      action: {
        payload: ChangeLetterPanelLocationInWordPayload;
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isLetterPanelSettings(panel.typeSpecificData)) {
        return;
      }
      panel.typeSpecificData.locationInWord = action.payload.newValue;
    },
    changeLetterPanelOffset: (
      state,
      action: {
        payload: ChangeLetterPanelOffsetPayload;
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isLetterPanelSettings(panel.typeSpecificData)) {
        return;
      }
      panel.typeSpecificData.offset = action.payload.newValue;
    },
    changeLetterPanelDisplay: (
      state,
      action: {
        payload: ChangeLetterPanelDisplayPayload;
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isLetterPanelSettings(panel.typeSpecificData)) {
        return;
      }
      panel.typeSpecificData.display = action.payload.newValue;
    },
    addSearch: (
      state,
      action: {
        payload: { panelId: number; search: SearchPanelSearch };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isSearchPanelData(panel.typeSpecificData)) {
        return;
      }
      panel.typeSpecificData.searches.push(action.payload.search);
    },
    removeSearch: (
      state,
      action: {
        payload: { panelId: number; searchId: number };
        type: string;
      },
    ) => {
      const panel = findPanel(state, action.payload.panelId);
      if (!panel || !isSearchPanelData(panel.typeSpecificData)) {
        return;
      }
      const searchToRemove = panel.typeSpecificData.searches.find(
        (searchObject) => {
          return searchObject.searchId === action.payload.searchId;
        },
      );
      if (!searchToRemove) {
        return;
      }
      const searchIndex =
        panel.typeSpecificData.searches.indexOf(searchToRemove);
      panel.typeSpecificData.searches.splice(searchIndex, 1);
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setCurrentProfile,
  removePanel,
  setIsCollapsed,
  setSettingsAreCollapsed,
  duplicatePanel,
  setTracking,
  setInitialDisplay,
  changeLetterPanelNumberOfLetters,
  changeLetterPanelLocationInWord,
  changeLetterPanelOffset,
  changeLetterPanelDisplay,
  addSearch,
  removeSearch,
} = hintProfilesSlice.actions;

export const selectHintProfiles = (state: RootState) => state.hintProfiles.data;

export default hintProfilesSlice.reducer;
