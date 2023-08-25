import { apiSlice } from "../api/apiSlice";
import {
  HintPanelData,
  HintPanelCreateForm,
  HintPanelUpdateForm,
  HintProfilesData,
  UserHintProfileBasic,
  UserHintProfileComplete,
  UserHintProfileForm,
  CompleteHintProfile,
  CurrentHintProfileFormData,
  HintProfileTypes,
} from "./types";

const maybeFindDefaultHintProfile = (
  formData: CurrentHintProfileFormData,
  profiles?: HintProfilesData,
): CompleteHintProfile | undefined => {
  if (!profiles) return;
  if (formData.current_hint_profile_type === HintProfileTypes.Default) {
    return profiles.defaultHintProfiles.find(
      (profile) => profile.id === formData.current_hint_profile_id,
    );
  }
};

export const hintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Hint Profiles
    // ✅Get all hint profiles, including default profiles
    getHintProfiles: builder.query<HintProfilesData, void>({
      query: () => ({
        url: "/hint_profiles",
      }),
    }),
    // ❌ Get only user hint profiles
    getUserHintProfiles: builder.query<UserHintProfileBasic[], void>({
      query: () => ({
        url: "/user_hint_profiles",
      }),
    }),
    // ✅ Get complete data for a user hint profile
    getUserHintProfile: builder.query<UserHintProfileComplete, number>({
      query: (id: number) => ({
        url: `user_hint_profiles/${id}`,
      }),
    }),
    // ✅
    createUserHintProfile: builder.mutation<
      UserHintProfileComplete,
      UserHintProfileForm
    >({}),
    // ✅
    updateUserHintProfile: builder.mutation<
      UserHintProfileBasic,
      UserHintProfileForm
    >({}),
    // ⚠️
    deleteUserHintProfile: builder.mutation<boolean, number>({}),
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
      onQueryStarted: async (
        formData,
        { getState, dispatch, getCacheEntry, queryFulfilled },
      ) => {
        const profiles =
          hintApiSlice.endpoints.getHintProfiles.select(undefined)(getState()).data;
        const maybeProfile = maybeFindDefaultHintProfile(formData, profiles);
        if (maybeProfile) {
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              undefined,
              maybeProfile,
            ),
          );
        } else {
          await queryFulfilled;
          const cacheEntry = getCacheEntry();
          if (cacheEntry.isSuccess && cacheEntry.data) {
            dispatch(
              hintApiSlice.util.upsertQueryData(
                "getCurrentHintProfile",
                undefined,
                cacheEntry.data,
              ),
            );
          }
        }
      },
    }),
    // Hint Panels
    // ⚠️
    createHintPanel: builder.mutation<HintPanelData, HintPanelCreateForm>({}),
    // ⚠️
    updateHintPanel: builder.mutation<HintPanelData, HintPanelUpdateForm>({}),
    // ⚠️
    deleteHintPanel: builder.mutation<boolean, number>({}),
  }),
});

export const { useSetCurrentHintProfileMutation } = hintApiSlice;
