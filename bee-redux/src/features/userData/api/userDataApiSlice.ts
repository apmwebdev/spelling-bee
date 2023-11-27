/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { apiSlice } from "@/features/api";
import {
  UserBaseData,
  UserPrefsData,
  UserPrefsFormData,
  UserPuzzleData,
} from "@/types";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { searchPanelSearchesApiSlice } from "@/features/searchPanelSearches";
import { userPuzzleAttemptsApiSlice } from "@/features/userPuzzleAttempts/api/userPuzzleAttemptsApiSlice";
import { guessesApiSlice, processGuess } from "@/features/guesses";
import { RootState } from "@/app/store";

// Meant to be used within an updateQueryData function to update state immutably.
// The 'prefs' parameter is a draft state and can be mutated safely. Because the
// draft state is being mutated, nothing needs to be returned.
const mapUserPrefsFormDataToUserPrefs = (
  formData: UserPrefsFormData,
  prefs: UserPrefsData,
) => {
  prefs.colorScheme = formData.color_scheme ?? prefs.colorScheme;
};

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserPrefs: builder.query<UserPrefsData, undefined>({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
    /**
     * Needs to update getUserPrefs endpoint with response.
     * Can use optimistic updates
     */
    updateUserPrefs: builder.mutation<boolean, UserPrefsFormData>({
      query: (formData) => ({
        url: "/user_prefs",
        method: "PATCH",
        body: formData,
      }),
      onQueryStarted: async (formData, api) => {
        await api.queryFulfilled;
        const cacheEntry = api.getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          api.dispatch(
            userDataApiSlice.util.updateQueryData(
              "getUserPrefs",
              undefined,
              (draft) => {
                mapUserPrefsFormDataToUserPrefs(formData, draft);
              },
            ),
          );
        }
      },
    }),
    /**
     * For initial page load. Can fetch before puzzle loads. Combines
     * - getHintProfiles from hintPanelsApiSlice
     * - getCurrentHintProfile, if applicable, from hintPanelsApiSlice
     * - getPrefs
     * Those 3 endpoints need to be updated with the returned data
     */
    getUserBaseData: builder.query<UserBaseData, void>({
      query: () => ({
        url: "/user_base_data",
      }),
      onQueryStarted: async (_args, api) => {
        await api.queryFulfilled;
        const cacheEntry = api.getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          const { data } = cacheEntry;
          api.dispatch(
            hintProfilesApiSlice.util.upsertQueryData(
              "getHintProfiles",
              undefined,
              data.hintProfiles,
            ),
          );
          api.dispatch(
            hintProfilesApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              undefined,
              data.currentHintProfile,
            ),
          );
          if (data.prefs) {
            api.dispatch(
              userDataApiSlice.util.upsertQueryData(
                "getUserPrefs",
                undefined,
                data.prefs,
              ),
            );
          }
        }
      },
      providesTags: ["User"],
    }),
    /**
     * For after the puzzle loads, as it requires the puzzle ID. Combines
     * - getCurrentAttempts
     * - getSearches
     * - getDefinitions (not implemented yet)
     */
    getUserPuzzleData: builder.query<UserPuzzleData, number>({
      query: (puzzleId: number) => ({
        url: `/user_puzzle_data/${puzzleId}`,
      }),
      providesTags: ["User"],
      onQueryStarted: async (_puzzleId, api) => {
        await api.queryFulfilled;
        const cacheEntry = api.getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          const { data } = cacheEntry;
          api.dispatch(
            userPuzzleAttemptsApiSlice.util.upsertQueryData(
              "getCurrentAttempts",
              undefined,
              data.attempts,
            ),
          );
          api.dispatch(
            searchPanelSearchesApiSlice.util.upsertQueryData(
              "getSearches",
              data.currentAttempt,
              data.searches,
            ),
          );
          api.dispatch(
            guessesApiSlice.util.upsertQueryData(
              "getGuesses",
              data.currentAttempt,
              data.guesses.map((guess) =>
                processGuess(guess, api.getState() as RootState),
              ),
            ),
          );
        }
      },
    }),
  }),
});

export const {
  useGetUserPrefsQuery,
  useUpdateUserPrefsMutation,
  useGetUserBaseDataQuery,
  useLazyGetUserPuzzleDataQuery,
} = userDataApiSlice;
