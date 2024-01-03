/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { CompleteHintProfile, HintProfilesData } from "@/features/hintProfiles";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { UserPuzzleAttempt } from "@/features/userPuzzleAttempts";
import { GuessFormat } from "@/features/guesses";
import { hasAllProperties, isPlainObject } from "@/types/globalTypes";
import { createTypedSuccessResponseTypeGuard } from "@/features/api";

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
  attempts: UserPuzzleAttempt[];
  currentAttempt: string;
  guesses: GuessFormat[];
};

export const isUserPuzzleData = (toTest: any): toTest is UserPuzzleData => {
  return (
    //TODO: Eventually check for currentAttempt as well
    isPlainObject(toTest) &&
    hasAllProperties(toTest, ["searches", "attempts", "guesses"])
  );
};

export const isUserPuzzleDataResponse =
  createTypedSuccessResponseTypeGuard<UserPuzzleData>(isUserPuzzleData);
