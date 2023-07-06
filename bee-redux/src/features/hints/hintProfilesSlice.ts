import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
// import { defaultProfiles } from "./hintProfilesAPI"

/**
 * For determining how to live update the hints when correct guesses are made
 */
export enum TrackingOptions {
  RemainingOfTotal = "REMAINING_OF_TOTAL", //show "[remaining #] of [total #] of hint
  FoundOfTotal = "FOUND_OF_TOTAL", //show "[found #] of [total #]" of hint
  Remaining = "REMAINING", //show remaining # only
  Found = "FOUND", //show found # only
  Total = "TOTAL", //show total [hint] only, i.e., no live updates
}

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
  Sticky = "STICKY",
}

export enum PanelTypes {
  Basic = "BASIC",
  Letter = "LETTER",
  Search = "SEARCH",
  ExcludedWords = "EXCLUDED_WORDS",
  WordObscurity = "WORD_OBSCURITY",
  Definitions = "DEFINITIONS",
}

export interface BasicPanelSettings {
  showWordCount: boolean
  showTotalPoints: boolean
  showPangramCount: boolean
  showPerfectPangramCount: boolean
}

export function isBasicPanelSettings(a: any): a is BasicPanelSettings {
  return a.showWordCount !== undefined
}

export enum LetterPanelLocations {
  Beginning = "BEGINNING",
  End = "END",
}

export enum StringHintDisplayOptions {
  LettersOnly = "LETTERS_ONLY",
  WordCountList = "WORD_COUNT_LIST",
  WordLengthGrid = "WORD_LENGTH_GRID",
}

export interface LetterPanelSettings {
  numberOfLetters: number
  locationInWord: LetterPanelLocations
  offset: number
  display: StringHintDisplayOptions
}

export enum SearchPanelLocations {
  Beginning = "BEGINNING",
  End = "END",
  Anywhere = "ANYWHERE",
}

export interface SearchPanelSettings {
  searchLocation: SearchPanelLocations
  offset: number
  display: StringHintDisplayOptions
}

export interface ExcludedWordsPanelSettings {}

export interface WordObscurityPanelSettings {}

export interface DefinitionsPanelSettings {}

export interface HintPanelFormat {
  id: number
  name: string
  isCollapsed: boolean
  isBlurred: boolean
  tracking: TrackingOptions
  initialDisplay: PanelInitialDisplayOptions
  type: PanelTypes
  typeOptions:
    | BasicPanelSettings
    | LetterPanelSettings
    | SearchPanelSettings
    | ExcludedWordsPanelSettings
    | WordObscurityPanelSettings
    | DefinitionsPanelSettings
}

export enum ProfileDisplayDefaults {
  Expanded = "EXPANDED",
  Blurred = "BLURRED",
  Collapsed = "COLLAPSED",
}

export interface HintProfileFormat {
  id: number
  name: string
  isUserCreated: boolean
  displayDefault: ProfileDisplayDefaults
  trackingDefault: TrackingOptions
  panels: HintPanelFormat[]
}

export const blankHintProfile: HintProfileFormat = {
  id: -1,
  name: "None",
  isUserCreated: false,
  displayDefault: ProfileDisplayDefaults.Expanded,
  trackingDefault: TrackingOptions.RemainingOfTotal,
  panels: [],
}

export interface HintProfilesStateData {
  currentProfile: HintProfileFormat
  profiles: HintProfileFormat[]
}

export interface HintProfilesState {
  data: HintProfilesStateData
  status: string
}

const superSpellingBeeProfile = (): HintProfileFormat => {
  return {
    id: 0,
    name: "Super Spelling Bee",
    isUserCreated: false,
    displayDefault: ProfileDisplayDefaults.Expanded,
    trackingDefault: TrackingOptions.RemainingOfTotal,
    panels: [
      {
        id: 0,
        name: "Basic Info",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Basic,
        typeOptions: {
          showWordCount: true,
          showTotalPoints: true,
          showPangramCount: true,
          showPerfectPangramCount: true,
        },
      },
      {
        id: 1,
        name: "Remaining Words",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeOptions: {
          numberOfLetters: 1,
          locationInWord: LetterPanelLocations.Beginning,
          offset: 0,
          display: StringHintDisplayOptions.WordLengthGrid,
        },
      },
      {
        id: 2,
        name: "Starting Letters x Word Lengths",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeOptions: {
          numberOfLetters: 2,
          locationInWord: LetterPanelLocations.Beginning,
          offset: 0,
          display: StringHintDisplayOptions.WordLengthGrid,
        },
      },
      {
        id: 3,
        name: "Word Obscurity Ranking",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.WordObscurity,
        typeOptions: {},
      },
      {
        id: 4,
        name: "String Search",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Search,
        typeOptions: {
          searchLocation: SearchPanelLocations.Anywhere,
          offset: 0,
          display: StringHintDisplayOptions.LettersOnly,
        },
      },
      {
        id: 5,
        name: "Definitions",
        isCollapsed: true,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Collapsed,
        type: PanelTypes.Definitions,
        typeOptions: {},
      },
      {
        id: 6,
        name: "Excluded Words",
        isCollapsed: true,
        isBlurred: false,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Collapsed,
        type: PanelTypes.ExcludedWords,
        typeOptions: {},
      },
    ],
  }
}

const spellingBeeBuddyProfile = (): HintProfileFormat => {
  return {
    id: 1,
    name: "NYT Spelling Bee Buddy",
    isUserCreated: false,
    displayDefault: ProfileDisplayDefaults.Blurred,
    trackingDefault: TrackingOptions.Remaining,
    panels: [
      {
        id: 7,
        name: "Basic info",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Basic,
        typeOptions: {
          showWordCount: true,
          showTotalPoints: true,
          showPangramCount: true,
          showPerfectPangramCount: false,
        },
      },
      {
        id: 8,
        name: "Your Grid of Remaining Words",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.Remaining,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeOptions: {
          numberOfLetters: 1,
          locationInWord: LetterPanelLocations.Beginning,
          offset: 0,
          display: StringHintDisplayOptions.WordLengthGrid,
        },
      },
      {
        id: 9,
        name: "Your Two-Letter List",
        isCollapsed: false,
        isBlurred: false,
        tracking: TrackingOptions.Remaining,
        initialDisplay: PanelInitialDisplayOptions.Expanded,
        type: PanelTypes.Letter,
        typeOptions: {
          numberOfLetters: 2,
          locationInWord: LetterPanelLocations.Beginning,
          offset: 0,
          display: StringHintDisplayOptions.WordCountList,
        },
      },
      {
        id: 10,
        name: "Word Obscurity Ranking",
        isCollapsed: false,
        isBlurred: true,
        tracking: TrackingOptions.FoundOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Blurred,
        type: PanelTypes.WordObscurity,
        typeOptions: {},
      },
      {
        id: 11,
        name: "Definitions",
        isCollapsed: false,
        isBlurred: true,
        tracking: TrackingOptions.RemainingOfTotal,
        initialDisplay: PanelInitialDisplayOptions.Blurred,
        type: PanelTypes.Definitions,
        typeOptions: {},
      },
    ],
  }
}

const initialState = (): HintProfilesState => {
  const ssbProfile = superSpellingBeeProfile()
  return {
    data: {
      currentProfile: ssbProfile,
      profiles: [ssbProfile, spellingBeeBuddyProfile()],
    },
    status: "stub",
  }
}

export interface ChangeProfilePayload {
  newId: number
}

export interface ChangeBasicPanelSubsectionDisplayPayload {
  panelId: number
  settingName:
    | "showWordCount"
    | "showTotalPoints"
    | "showPangramCount"
    | "showPerfectPangramCount"
  newValue: boolean
}

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
      )
      if (newCurrent) {
        state.data.currentProfile = newCurrent
      }
    },
    changeBasicPanelSubsectionDisplay: (
      state,
      action: {
        payload: ChangeBasicPanelSubsectionDisplayPayload
        type: string
      },
    ) => {
      const panel = state.data.currentProfile.panels.find((profilePanel) => {
        return profilePanel.id === action.payload.panelId
      })
      if (!panel || !isBasicPanelSettings(panel.typeOptions)) {
        return
      }
      for (const property in panel.typeOptions) {
        if (property === action.payload.settingName) {
          panel.typeOptions[property] = action.payload.newValue
        }
      }
    },
  },
  extraReducers: (builder) => {},
})

export const { setCurrentProfile, changeBasicPanelSubsectionDisplay } =
  hintProfilesSlice.actions

export const selectHintProfiles = (state: RootState) => state.hintProfiles.data

export default hintProfilesSlice.reducer
