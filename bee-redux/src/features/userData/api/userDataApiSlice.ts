import { apiSlice, persister } from "@/features/api";
import { hintApiSlice } from "@/features/hints";
import {
  UserBaseData,
  UserPrefsData,
  UserPrefsFormData,
  UserPuzzleData,
} from "@/types";
import { guessesApiSlice, processAttempts } from "@/features/guesses";
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
    getUserPrefs: builder.query<UserPrefsData, boolean>({
      query: (_shouldCache) => ({
        url: "/user_prefs",
      }),
      onQueryStarted: async (
        shouldCache,
        { queryFulfilled, getCacheEntry },
      ) => {
        if (shouldCache) {
          await queryFulfilled;
          const cacheEntry = getCacheEntry();
          if (cacheEntry.isSuccess && cacheEntry.data) {
            persister.save("userPrefs", cacheEntry.data);
          }
        }
      },
    }),
    /**
     * Needs to update getUserPrefs endpoint with response.
     * Can use optimistic updates
     */
    updateUserPrefs: builder.mutation<boolean, UserPrefsFormData>({
      queryFn: async (formData, api, _opts, baseQuery) => {
        api.dispatch(
          userDataApiSlice.util.updateQueryData(
            "getUserPrefs",
            true,
            (draft) => {
              mapUserPrefsFormDataToUserPrefs(formData, draft);
            },
          ),
        );
        const state = api.getState() as RootState;
        if (state.auth.user) {
          await baseQuery({
            url: "/user_prefs",
            method: "PATCH",
            body: formData,
          });
        }
        return { data: true };
      },
    }),
    /**
     * For initial page load. Can fetch before puzzle loads. Combines
     * - getHintProfiles from hintApiSlice
     * - getCurrentHintProfile, if applicable, from hintApiSlice
     * - getPrefs
     * Those 3 endpoints need to be updated with the returned data
     * The latter 2 can be loaded from localStorage
     */
    getUserBaseData: builder.query<UserBaseData, void>({
      queryFn: async (_args, { dispatch }, _opts, baseQuery) => {
        //Load prefs and current profile from localStorage
        const storedPrefs = persister.load("userPrefs");
        if (storedPrefs) {
          dispatch(
            userDataApiSlice.util.upsertQueryData(
              "getUserPrefs",
              false,
              storedPrefs.parsed,
            ),
          );
        }
        const storedCurrentProfile = persister.load("currentHintProfile");
        if (storedCurrentProfile) {
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              false,
              storedCurrentProfile.parsed,
            ),
          );
        }

        //Get the response from the server
        const response = await baseQuery({
          url: "/user_base_data",
        });
        const data = response.data as UserBaseData;

        //Always upsert the default profiles
        dispatch(
          hintApiSlice.util.upsertQueryData(
            "getHintProfiles",
            undefined,
            data.hintProfiles,
          ),
        );
        // If returned prefs are different from stored prefs, go with returned
        // prefs
        if (
          data.isLoggedIn &&
          JSON.stringify(data.prefs) !== storedPrefs?.saved
        ) {
          dispatch(
            userDataApiSlice.util.upsertQueryData(
              "getUserPrefs",
              true,
              data.prefs,
            ),
          );
        }
        //If returned currentHintProfile is different from stored, overwrite
        // stored with returned
        if (
          data.isLoggedIn &&
          JSON.stringify(
            JSON.stringify(data.currentHintProfile) !==
              storedCurrentProfile?.saved,
          )
        ) {
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              true,
              data.currentHintProfile,
            ),
          );
        }

        //The return value is not super important here since this query only
        // exists to update data for the associated "atomic" queries.
        return { data };
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
      onQueryStarted: async (
        _puzzleId,
        { dispatch, getState, getCacheEntry, queryFulfilled },
      ) => {
        await queryFulfilled;
        const cacheEntry = getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          const { data } = cacheEntry;
          dispatch(
            guessesApiSlice.util.upsertQueryData(
              "getCurrentAttempts",
              undefined,
              processAttempts(data.attempts, getState() as RootState),
            ),
          );
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getSearches",
              data.currentAttempt,
              data.searches,
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
