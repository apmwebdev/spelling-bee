import {
  CompleteHintProfile,
  HintProfileBasicData,
  HintProfilesData,
  SearchPanelSearch,
} from "@/features/hints";
import { AttemptFormat } from "@/features/guesses/guessesSlice";

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
  searches: SearchPanelSearch[];
  attempts: AttemptFormat[];
  currentAttempt: number;
}
