/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  CompleteHintProfile,
  HintProfilesData,
} from "@/features/hintProfiles/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { SerializedError } from "@reduxjs/toolkit";
import { AttemptFormat } from "@/features/userPuzzleAttempts/types";
import { RawGuessFormat } from "@/features/guesses";

export enum Statuses {
  Initial = "Not Fetched",
  Pending = "Loading...",
  UpToDate = "Up to Date",
  Error = "Error",
}

const MessageStatuses = ["Success", "Warning", "Error", "Disabled"] as const;
export type MessageStatus = (typeof MessageStatuses)[number];

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
  attempts: AttemptFormat[];
  currentAttempt: string;
  guesses: RawGuessFormat[];
};

export type StateShape<dataShape> = {
  data: dataShape;
  status: Statuses;
  error: FetchBaseQueryError | undefined;
};

export const createInitialState = (data: any): StateShape<typeof data> => ({
  data,
  status: Statuses.Initial,
  error: undefined,
});

export type EnumerableOption = {
  title: string;
};

export type EnumeratedOptions = {
  [key: string]: EnumerableOption;
};

export enum SortOrderKeys {
  asc = "asc",
  desc = "desc",
}

export const SortOrderOptions: EnumeratedOptions = {
  asc: { title: "Ascending" },
  desc: { title: "Descending" },
};

export type BasicResponse = {
  success: string;
};

export const isSuccessfulResponse = (
  response: any,
): response is { data: any } => "data" in response;

export const isErrorResponse = (response: any): response is { error: any } =>
  "error" in response;

export const isFetchBaseQueryErrorResponse = (
  response: any,
): response is { error: FetchBaseQueryError } =>
  isErrorResponse(response) && "status" in response.error;

export const isSerializedErrorResponse = (
  response: any,
): response is { error: SerializedError } =>
  isErrorResponse(response) && !("status" in response.error);

export type BasicError = {
  data: {
    error: string;
  };
  status: number;
};
export const isBasicError = (response: any): response is BasicError =>
  "data" in response &&
  "error" in response.data &&
  typeof response.data.error === "string";

/**
 * For validating email addresses submitted at sign-up
 * Copied from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
 * This mirrors the validation that browsers do on email input fields.
 * The regex essentially says that the following format is valid:
 * - One or more characters that are letters, digits, or various symbols
 * - An @ symbol
 * - 1-63 characters that are letters, numbers, or dashes. The first and last
 *   characters in this sequence can't be dashes.
 * - 0 to 1 instances of:
 *   - A period
 *   - 1-63 characters that are letters, numbers, or dashes. The first and last
 *     characters in this sequence can't be dashes.
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * For password validation
 * It requires that the length be 10-128 characters and include at least one of
 * each of the following:
 * - A capital letter
 * - A lowercase letter
 * - A number
 * - A non-digit, non-letter, non-whitespace character
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\sa-zA-Z]).{10,128}$/;
