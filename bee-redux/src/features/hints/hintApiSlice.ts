import { apiSlice } from "../api/apiSlice";
import * as t from "./types";
import { RootState } from "@/app/store";
import { addDebouncer } from "@/features/api/util/debouncer";
import { keysToSnakeCase } from "@/features/api/util";
import {
  HintProfileTypes,
  SearchPanelSearchData,
  SearchPanelSearchDeleteArgs,
} from "./types";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { selectCurrentAttemptId } from "@/features/guesses/guessesSlice";
import { createSelector } from "@reduxjs/toolkit";

const maybeFindDefaultHintProfile = (
  formData: t.CurrentHintProfileFormData,
  profiles?: t.HintProfilesData,
): t.CompleteHintProfile | undefined => {
  if (!profiles) return;
  if (formData.current_hint_profile_type === t.HintProfileTypes.Default) {
    return profiles.defaultHintProfiles.find(
      (profile) => profile.id === formData.current_hint_profile_id,
    );
  }
};

const railsifyUpdatePanelData = (formData: t.HintPanelUpdateForm) => {
  const railsData: t.RailsHintPanelUpdateForm = {
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

const railsifyAddSearchData = (newSearch: t.SearchPanelSearchData) => {
  return {
    search_panel_search: {
      ...keysToSnakeCase(newSearch),
      user_puzzle_attempt_id: newSearch.attemptId,
      attempt_id: undefined,
    },
  };
};

export const hintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Hint Profiles

    // ✅Get all hint profiles, including default profiles
    getHintProfiles: builder.query<t.HintProfilesData, void>({
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
    getCurrentHintProfile: builder.query<t.CompleteHintProfile, void>({
      query: () => ({
        url: "/current_hint_profile",
      }),
    }),

    // ✅
    setCurrentHintProfile: builder.mutation<
      t.CompleteHintProfile,
      t.CurrentHintProfileFormData
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
        const profiles = hintApiSlice.endpoints.getHintProfiles.select(
          undefined,
        )(getState()).data;
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
    // createHintPanel: builder.mutation<t.HintPanelData, t.HintPanelCreateForm>({}),

    /**
     * ✅
     * Can debounce
     * Uses optimistic updates
     * Manually updates getCurrentHintProfile endpoint data
     * Guest users + modifications to default panels save only to local storage
     */
    updateHintPanel: builder.mutation<boolean, t.HintPanelUpdateForm>({
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
          selectCurrentHintProfile(state)?.type === HintProfileTypes.Default
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
    deleteHintPanel: builder.mutation<boolean, number>({
      queryFn: (id, api, _opts, baseQuery) => {
        return { data: true };
      },
    }),

    //Searches

    /**
     * ✅
     * Updated from getUserPuzzleData, addSearch, and deleteSearch
     */
    getSearches: builder.query<t.SearchPanelSearchData[], number>({
      query: (attemptId) => ({
        url: `/search_panel_search/${attemptId}`,
      }),
    }),

    /**
     * ✅
     * Does NOT debounce. This must be handled in the component
     * Uses optimistic updates
     * Updates getSearches endpoint data
     * Guest users save only to local storage
     */
    addSearch: builder.mutation<
      t.SearchPanelSearchData,
      t.SearchPanelSearchData
    >({
      queryFn: async (newSearch, api, _opts, baseQuery) => {
        //Optimistically update getSearches with new search
        api.dispatch(
          hintApiSlice.util.updateQueryData(
            "getSearches",
            newSearch.attemptId,
            (searches) => {
              searches.unshift(newSearch);
            },
          ),
        );
        const state = api.getState() as RootState;
        if (
          state.auth.isGuest ||
          selectCurrentHintProfile(api.getState() as RootState)?.type ===
            t.HintProfileTypes.Default
        ) {
          return { data: newSearch };
        }
        const response = (await baseQuery({
          url: "/search_panel_searches",
          method: "POST",
          body: railsifyAddSearchData(newSearch),
        })) as QueryReturnValue<
          SearchPanelSearchData,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;
        //Update the new search with the ID from the back end
        api.dispatch(
          hintApiSlice.util.updateQueryData(
            "getSearches",
            newSearch.attemptId,
            (searches) => {
              const searchToUpdate = searches.find(
                (spsData) => spsData.createdAt === newSearch.createdAt,
              );
              if (!searchToUpdate) return;
              searchToUpdate.id = response.data?.id;
            },
          ),
        );

        return response;
      },
    }),

    // ✅
    deleteSearch: builder.mutation<boolean, SearchPanelSearchDeleteArgs>({
      queryFn: async (arg, api, _opts, baseQuery) => {
        const state = api.getState() as RootState;
        api.dispatch(
          hintApiSlice.util.updateQueryData(
            "getSearches",
            selectCurrentAttemptId(state),
            (draftState) => {
              if (draftState.length === 0) return;
              const indexToRemove = draftState.findIndex(
                (search) => search.createdAt === arg.createdAt,
              );
              if (indexToRemove > -1) {
                draftState.splice(indexToRemove, 1);
              }
            },
          ),
        );
        if (state.auth.isGuest || !arg.id) {
          return { data: true };
        }
        try {
          await baseQuery({
            url: `/search_panel_searches/${arg.id}`,
            method: "DELETE",
          });
        } catch (err) {
          console.log("Couldn't delete search on back end:", err);
        }
        return { data: true };
      },
    }),

    //Maybe not needed

    // ❌ Get only user hint profiles
    getUserHintProfiles: builder.query<t.UserHintProfileBasic[], void>({
      query: () => ({
        url: "/user_hint_profiles",
      }),
    }),
    // ✅❌ Implemented, but maybe not needed?
    getUserHintProfile: builder.query<t.UserHintProfileComplete, number>({
      query: (id: number) => ({
        url: `user_hint_profiles/${id}`,
      }),
    }),
  }),
});

export const {
  useUpdateHintPanelMutation,
  useSetCurrentHintProfileMutation,
  useLazyGetSearchesQuery,
  useAddSearchMutation,
  useDeleteSearchMutation,
} = hintApiSlice;

export const selectCurrentHintProfile = (state: RootState) =>
  hintApiSlice.endpoints.getCurrentHintProfile.select()(state).data;

export const selectPanels = createSelector(
  [selectCurrentHintProfile],
  (profile) => profile?.panels ?? [],
);

export const selectPanelIds = createSelector([selectPanels], (panels) => {
  if (!panels) return [];
  return panels.map((panel) => panel.id);
});
