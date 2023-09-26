import { SearchPanelSearchData } from "@/features/hints";
import { RawAttemptFormat } from "@/features/guesses";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  CompleteHintProfile,
  HintProfilesData,
} from "@/features/hintProfiles/types";

export enum Statuses {
  Initial = "Not Fetched",
  Pending = "Loading...",
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
export type UserPrefsFormData = {
  color_scheme?: ColorSchemes;
};

export type UserPrefsData = {
  colorScheme: ColorSchemes;
  // currentHintProfile: HintProfileBasicData;
};
export type UserBaseData = {
  prefs: UserPrefsData;
  hintProfiles: HintProfilesData;
  currentHintProfile: CompleteHintProfile;
  isLoggedIn: boolean;
};

export type UserPuzzleData = {
  searches: SearchPanelSearchData[];
  attempts: RawAttemptFormat[];
  currentAttempt: number;
};

export type StateShape<dataShape> = {
  data: dataShape;
  status: Statuses;
  error: FetchBaseQueryError | undefined;
};
