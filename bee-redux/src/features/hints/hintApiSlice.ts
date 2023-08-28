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
  PanelDisplayState,
  RailsHintPanelUpdateForm,
} from "./types";
import { AppDispatch, RootState, store } from "@/app/store";
import { addDebouncer } from "@/features/api/util/debouncer";
import { keysToSnakeCase } from "@/features/api/util";

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

const railsifyUpdatePanelData = (formData: HintPanelUpdateForm) => {
  const railsData: RailsHintPanelUpdateForm = {
    hint_panel: {
      id: formData.id,
      name: formData.name,
      initial_display_state_attributes: formData.initialDisplayState
        ? keysToSnakeCase(formData.initialDisplayState)
        : undefined,
      current_display_state_attributes: formData.currentDisplayState
        ? keysToSnakeCase(formData.currentDisplayState)
        : undefined,
      status_tracking: formData.statusTracking,
    },
  };
  return railsData;
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
    updateHintPanel: builder.mutation<boolean, HintPanelUpdateForm>({
      queryFn: async (formData, api, _opts, baseQuery) => {
        api.dispatch(
          hintApiSlice.util.updateQueryData(
            "getCurrentHintProfile",
            undefined,
            (draftState) => {
              if (!draftState) return;
              const panel = draftState.panels.find(
                (hintPanel) => hintPanel.id === formData.id,
              );
              if (!panel) return;
              Object.assign(panel, formData);
            },
          ),
        );
        const state = api.getState() as RootState;
        if (
          state.auth.isGuest ||
          selectCurrentHintProfile?.type === HintProfileTypes.Default
        ) {
          return { data: true };
        }
        const query = async () => {
          console.log("Running query...");
          try {
            await baseQuery({
              url: `/hint_panels/${formData.id}`,
              method: "PATCH",
              body: railsifyUpdatePanelData(formData),
            });
          } catch (err) {
            console.log("Couldn't update DB with updated panel data:", err);
          }
        };
        if (formData.debounceField) {
          addDebouncer({
            key: `${formData.debounceField}Panel${formData.id}`,
            delay: 1000,
            callback: query,
          });
        } else {
          await query();
        }
        return { data: true };
      },
    }),
    // ⚠️
    deleteHintPanel: builder.mutation<boolean, number>({}),
  }),
});

export const { useUpdateHintPanelMutation, useSetCurrentHintProfileMutation } = hintApiSlice;

export const selectCurrentHintProfile =
  hintApiSlice.endpoints.getCurrentHintProfile.select()(store.getState()).data;

enum PanelCurrentDisplayUpdateKeys {
  isExpanded = "isExpanded",
  isBlurred = "isBlurred",
  isSticky = "isSticky",
  isSettingsExpanded = "isSettingsExpanded",
  isSettingsSticky = "isSettingsSticky",
}

export interface PanelCurrentDisplayParams {
  id: number;
  currentDisplayState: PanelDisplayState;
  toUpdateKey: PanelCurrentDisplayUpdateKeys;
  toUpdateValue: boolean;
}

export const updatePanelCurrentDisplay =
  ({
    id,
    currentDisplayState,
    toUpdateKey,
    toUpdateValue,
  }: PanelCurrentDisplayParams) =>
    (dispatch: AppDispatch, getState: () => RootState) => {
      if (toUpdateKey === PanelCurrentDisplayUpdateKeys.isExpanded) {
        if (toUpdateValue === currentDisplayState.isExpanded) return;

      }
    };
