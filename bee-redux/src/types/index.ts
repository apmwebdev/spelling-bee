import {
  CompleteHintProfile,
  HintProfileBasicData,
  HintProfilesData,
  SearchPanelSearchData,
} from "@/features/hints";
import { RawAttemptFormat } from "@/features/guesses";

export enum Statuses {
  Initial = "Not Fetched",
  Loading = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

export enum ColorSchemes {
  Auto = "auto",
  Light = "light",
  Dark = "dark",
}

// If either current_hint_profile_type OR current_hint_profile_id is defined,
// they both must be defined. Current_hint_profile is a polymorphic
// association in Rails, so it requires both fields.
export interface UserPrefsFormData {
  color_scheme?: ColorSchemes;
}

export interface UserPrefsData {
  colorScheme: ColorSchemes;
  currentHintProfile: HintProfileBasicData;
}
export interface UserBaseData {
  prefs: UserPrefsData;
  hintProfiles: HintProfilesData;
  currentHintProfile: CompleteHintProfile;
}

export interface UserPuzzleData {
  searches: SearchPanelSearchData[];
  attempts: RawAttemptFormat[];
  currentAttempt: number;
}
