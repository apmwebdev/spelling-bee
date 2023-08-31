import { apiSlice } from "../api/apiSlice";
import {
  CompleteHintProfile,
  CurrentHintProfileFormData,
  HintPanelCreateForm,
  HintPanelData,
  HintPanelUpdateForm,
  HintProfilesData,
  HintProfileTypes,
  PanelSubTypeTypes,
  RailsHintPanelUpdateForm,
  UserHintProfileBasic,
  UserHintProfileComplete,
  UserHintProfileForm,
} from "./types";
import { RootState, store } from "@/app/store";
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
      display_index: formData.displayIndex,
      status_tracking: formData.statusTracking,
      initial_display_state_attributes: keysToSnakeCase(
        formData.initialDisplayState,
      ),
      current_display_state_attributes: keysToSnakeCase(
        formData.currentDisplayState,
      ),
      panel_subtype_attributes: keysToSnakeCase(formData.typeData),
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
    // ✅
    createUserHintProfile: builder.mutation<
      UserHintProfileComplete,
      UserHintProfileForm
    >({}),
    // ✅ Only for updating the profile itself. Updating panels is handled below.
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

    /**
     * ✅
     * Can debounce
     * Uses optimistic updates
     * Manually updates getCurrentHintProfile endpoint data
     * Guest users + modifications to default panels save only to local storage
     */
    updateHintPanel: builder.mutation<boolean, HintPanelUpdateForm>({
      queryFn: async (formData, api, _opts, baseQuery) => {
        //Optimistically update getCurrentHintProfile with panel mutations
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
              if (formData.name) panel.name = formData.name;
              if (formData.statusTracking)
                panel.statusTracking = formData.statusTracking;
              Object.assign(
                panel.initialDisplayState,
                formData.initialDisplayState,
              );
              Object.assign(
                panel.currentDisplayState,
                formData.currentDisplayState,
              );
              Object.assign(panel.typeData, formData.typeData);
            },
          ),
        );
        //Return early if user is guest user or current profile is a default profile
        //Otherwise, run the actual query
        const state = api.getState() as RootState;
        if (
          state.auth.isGuest ||
          selectCurrentHintProfile?.type === HintProfileTypes.Default
        ) {
          return { data: true };
        }
        const query = async () => {
          console.log("Running updateHintPanel query...");
          console.log("Form data:", formData);
          try {
            const response = await baseQuery({
              url: `/hint_panels/${formData.id}`,
              method: "PATCH",
              body: railsifyUpdatePanelData(formData),
            });
            console.log("Response:", response);
          } catch (err) {
            console.log("Couldn't update DB with updated panel data:", err);
          }
        };
        //Debounce query if applicable. Otherwise, just run it.
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

    //Maybe not needed

    // ❌ Get only user hint profiles
    getUserHintProfiles: builder.query<UserHintProfileBasic[], void>({
      query: () => ({
        url: "/user_hint_profiles",
      }),
    }),
    // ✅❌ Implemented, but maybe not needed?
    getUserHintProfile: builder.query<UserHintProfileComplete, number>({
      query: (id: number) => ({
        url: `user_hint_profiles/${id}`,
      }),
    }),
  }),
});

export const { useUpdateHintPanelMutation, useSetCurrentHintProfileMutation } =
  hintApiSlice;

export const selectCurrentHintProfile =
  hintApiSlice.endpoints.getCurrentHintProfile.select()(store.getState()).data;
