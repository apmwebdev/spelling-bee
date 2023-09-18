import { apiSlice } from "@/features/api";
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
    /** Triggers getUserHintProfile if currentHintProfile is a UserHintProfile.*/
    getUserPrefs: builder.query<UserPrefsData, void>({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
    /**
     * Needs to update getUserPrefs endpoint with response.
     * Can use optimistic updates
     */
    updateUserPrefs: builder.mutation<UserPrefsData, UserPrefsFormData>({
      query: (formData) => ({
        url: "/user_prefs",
        method: "PATCH",
        body: formData,
      }),
      onQueryStarted: (formData, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userDataApiSlice.util.updateQueryData(
            "getUserPrefs",
            undefined,
            (draft) => {
              mapUserPrefsFormDataToUserPrefs(formData, draft);
            },
          ),
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),
    /**
     * For initial page load. Can fetch before puzzle loads. Combines
     * - getPrefs
     * - getHintProfiles from hintApiSlice
     * - getCurrentHintProfile, if applicable, from hintApiSlice
     * Those 3 endpoints need to be updated with the returned data
     */
    getUserBaseData: builder.query<UserBaseData, void>({
      query: () => ({
        url: "/user_base_data",
      }),
      onQueryStarted: async (
        _arg,
        { dispatch, getCacheEntry, queryFulfilled },
      ) => {
        await queryFulfilled;
        const cacheEntry = getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          const { data } = cacheEntry;
          dispatch(
            userDataApiSlice.util.upsertQueryData(
              "getUserPrefs",
              undefined,
              data.prefs,
            ),
          );
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getHintProfiles",
              undefined,
              data.hintProfiles,
            ),
          );
          dispatch(
            hintApiSlice.util.upsertQueryData(
              "getCurrentHintProfile",
              undefined,
              data.currentHintProfile,
            ),
          );
        }
      },
    }),
    /**
     * For after the puzzle loads, as it requires the puzzle ID. Combines
     * - getCurrentAttempts
     * - getSearches
     * - getDefinitions
     */
    getUserPuzzleData: builder.query<UserPuzzleData, number>({
      query: (puzzleId: number) => ({
        url: `/user_puzzle_data/${puzzleId}`,
      }),
      onQueryStarted: async (
        puzzleId,
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
