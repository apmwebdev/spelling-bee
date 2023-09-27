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
