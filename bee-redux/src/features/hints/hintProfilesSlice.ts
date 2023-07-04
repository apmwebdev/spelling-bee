import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
// import { defaultProfiles } from "./hintProfilesAPI"

/**
 * For determining how to live update the hints when correct guesses are made
 */
export enum TrackingOptions {
  Both = "BOTH", //show remaining and total words
  Remaining = "REMAINING", //show remaining words only
  Total = "TOTAL", //show total words only, i.e., no live updates
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
  isCurrent: boolean
  isUserCreated: boolean
  displayDefault: ProfileDisplayDefaults
  trackingDefault: TrackingOptions
  panels: HintPanelFormat[]
}

export const blankHintProfile: HintProfileFormat = {
  id: -1,
  name: "None",
  isCurrent: true,
  isUserCreated: false,
  displayDefault: ProfileDisplayDefaults.Expanded,
  trackingDefault: TrackingOptions.Both,
  panels: [],
}

export interface HintProfilesState {
  data: HintProfileFormat[]
  status: string
}

const initialState: HintProfilesState = {
  data: [
    {
      id: 0,
      name: "Super Spelling Bee",
      isCurrent: true,
      isUserCreated: false,
      displayDefault: ProfileDisplayDefaults.Expanded,
      trackingDefault: TrackingOptions.Both,
      panels: [
        {
          name: "Basic Info",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
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
          name: "Remaining Words",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
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
          name: "Starting Letters x Word Lengths",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
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
          name: "Word Obscurity Ranking",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Expanded,
          type: PanelTypes.WordObscurity,
          typeOptions: {},
        },
        {
          name: "String Search",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Expanded,
          type: PanelTypes.Search,
          typeOptions: {
            searchLocation: SearchPanelLocations.Anywhere,
            offset: 0,
            display: StringHintDisplayOptions.LettersOnly,
          },
        },
        {
          name: "Definitions",
          isCollapsed: true,
          isBlurred: false,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Collapsed,
          type: PanelTypes.Definitions,
          typeOptions: {},
        },
        {
          name: "Excluded Words",
          isCollapsed: true,
          isBlurred: false,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Collapsed,
          type: PanelTypes.ExcludedWords,
          typeOptions: {},
        },
      ],
    },
    {
      id: 1,
      name: "NYT Spelling Bee Buddy",
      isCurrent: false,
      isUserCreated: false,
      displayDefault: ProfileDisplayDefaults.Blurred,
      trackingDefault: TrackingOptions.Remaining,
      panels: [
        {
          name: "Basic info",
          isCollapsed: false,
          isBlurred: false,
          tracking: TrackingOptions.Both,
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
          name: "Word Obscurity Ranking",
          isCollapsed: false,
          isBlurred: true,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Blurred,
          type: PanelTypes.WordObscurity,
          typeOptions: {},
        },
        {
          name: "Definitions",
          isCollapsed: false,
          isBlurred: true,
          tracking: TrackingOptions.Both,
          initialDisplay: PanelInitialDisplayOptions.Blurred,
          type: PanelTypes.Definitions,
          typeOptions: {},
        },
      ],
    },
  ],
  status: "stub",
}

export interface ChangeProfilePayload {
  oldCurrent: number
  newCurrent: number
}

export const hintProfilesSlice = createSlice({
  name: "hintProfiles",
  initialState,
  reducers: {
    setCurrentProfile: (state, action) => {
      const oldCurrent = state.data.find(
        (profile) => profile.id === action.payload.oldCurrent,
      )
      if (oldCurrent) {
        oldCurrent.isCurrent = false
      }
      const newCurrent = state.data.find(
        (profile) => profile.id === action.payload.newCurrent,
      )
      if (newCurrent) {
        newCurrent.isCurrent = true
      }
    },
  },
  extraReducers: {},
})

export const { setCurrentProfile } = hintProfilesSlice.actions

export const selectHintProfiles = (state: RootState) => state.hintProfiles.data
export const selectCurrentHintProfile = (state: RootState) => {
  const current = state.hintProfiles.data.find((el) => el.isCurrent)
  if (current) {
    return current
  }
  return blankHintProfile
}

export default hintProfilesSlice.reducer
