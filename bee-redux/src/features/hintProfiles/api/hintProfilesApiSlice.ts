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
import { RootState } from "@/app/store";
import {
  CompleteHintProfile,
  CurrentHintProfileFormData,
  HintProfilesData,
} from "@/features/hintProfiles";

export const hintProfilesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅Get all hint profiles, including default profiles
    getHintProfiles: builder.query<HintProfilesData, void>({
      query: () => ({
        url: "/hint_profiles",
      }),
    }),

    // ⚠️
    // createUserHintProfile: builder.mutation<
    //   t.UserHintProfileComplete,
    //   t.UserHintProfileForm
    // >({}),

    // ⚠️ Only for updating the profile itself. Updating panels is handled below.
    // updateUserHintProfile: builder.mutation<
    //   t.UserHintProfileBasic,
    //   t.UserHintProfileForm
    // >({}),

    // ⚠️
    deleteUserHintProfile: builder.mutation<boolean, number>({
      queryFn: (id, api, _opts, baseQuery) => {
        return { data: true };
      },
    }),

    // ✅
    getCurrentHintProfile: builder.query<CompleteHintProfile, void>({
      query: () => ({
        url: "/current_hint_profile",
      }),
    }),

    // ✅
    setCurrentHintProfile: builder.mutation<
      CompleteHintProfile,
      CurrentHintProfileFormData
    >({
      query: (formData) => ({
        url: "/current_hint_profile",
        method: "POST",
        body: formData,
      }),
      onQueryStarted: async (_formData, api) => {
        await api.queryFulfilled;
        const cacheEntry = api.getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          api.dispatch(
            hintProfilesApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              undefined,
              cacheEntry.data,
            ),
          );
        }
      },
    }),
  }),
});

export const { useSetCurrentHintProfileMutation } = hintProfilesApiSlice;

export const selectCurrentHintProfile = (state: RootState) =>
  hintProfilesApiSlice.endpoints.getCurrentHintProfile.select()(state).data;
