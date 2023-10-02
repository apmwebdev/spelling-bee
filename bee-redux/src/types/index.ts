import { RawAttemptFormat } from "@/features/guesses";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  CompleteHintProfile,
  HintProfilesData,
} from "@/features/hintProfiles/types";
import { SearchPanelSearchData } from "@/features/searchPanelSearches";
import { SerializedError } from "@reduxjs/toolkit";

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

export type SignupError = {
  data: {
    error: string;
  };
  status: number;
};
export const isSignupError = (response: any): response is SignupError =>
  "data" in response &&
  "error" in response.data &&
  typeof response.data.error === "string";
