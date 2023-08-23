import { apiSlice } from "../api/apiSlice";
import {
  CompleteHintProfile,
  CurrentHintProfileFormData,
  defaultCurrentHintProfile,
  HintProfileBasicData,
  HintProfilesData,
  HintProfileTypes,
  UserBaseData,
  UserPrefsData,
  UserPrefsFormData,
} from "@/features/hints";
import { store } from "@/app/store";
import { hintApiSlice } from "@/features/hints/hintApiSlice";

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
     * - getUserHintProfile, if applicable, from hintApiSlice
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
     * - getGuesses
     * - getSearches
     */
    getUserPuzzleData: builder.query<any, number>({
      query: (puzzleId: number) => ({
        url: `/user_puzzle_data/${puzzleId}`,
      }),
    }),
  }),
});

export const {
  useGetUserPrefsQuery,
  useUpdateUserPrefsMutation,
  useGetUserBaseDataQuery,
} = userDataApiSlice;
