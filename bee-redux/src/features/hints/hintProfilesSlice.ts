import { createSlice } from "@reduxjs/toolkit"
import { RootState } from '../../app/store';
import { defaultProfiles } from './hintProfilesAPI';

/**
 * For determining how to live update the hints when correct guesses are made
 */
export enum PanelTrackingOptions {
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
  Definitions = "DEFINITIONS"
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
  WordLengthGrid = "WORD_LENGTH_GRID"
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

export interface ExcludedWordsPanelSettings {
}

export interface WordObscurityPanelSettings {

}

export interface DefinitionsPanelSettings {

}

export interface HintPanelFormat {
  isCollapsed: boolean
  isBlurred: boolean
  tracking: PanelTrackingOptions
  initialDisplay: PanelInitialDisplayOptions
  type: PanelTypes
  typeOptions: BasicPanelSettings | LetterPanelSettings | SearchPanelSettings | ExcludedWordsPanelSettings | WordObscurityPanelSettings | DefinitionsPanelSettings
}

export interface HintProfileFormat {
}

export interface HintProfilesState {
  data: HintProfileFormat[]
  status: string
}

const initialState: HintProfilesState = {
  data: defaultProfiles,
  status: "stub"
}

export const hintProfilesSlice = createSlice({
  name: "hintProfiles",
  initialState,
  reducers: {},
  extraReducers: {},
})

export const {} = hintProfilesSlice.actions

export const selectHintProfiles = (state: RootState) state.hintProfiles.data

export default hintProfilesSlice.reducer