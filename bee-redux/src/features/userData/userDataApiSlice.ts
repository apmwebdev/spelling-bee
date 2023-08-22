import { apiSlice } from "../api/apiSlice";
import {
  defaultCurrentHintProfile,
  HintProfileBasicData,
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
  const currentProfile = prefs.currentHintProfile;
  currentProfile.type =
    formData.current_hint_profile_type ?? currentProfile.type;
  currentProfile.id = formData.current_hint_profile_id ?? currentProfile.id;
};

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Triggers getUserHintProfile if currentHintProfile is a UserHintProfile.*/
    getUserPrefs: builder.query<UserPrefsData, void>({
      query: () => ({
        url: "/user_prefs",
      }),
      onQueryStarted: async (
        _arg,
        { dispatch, getCacheEntry, queryFulfilled },
      ) => {
        await queryFulfilled;
        const cacheEntry = getCacheEntry();
        if (cacheEntry.isSuccess && cacheEntry.data) {
          const { type, id } = cacheEntry.data.currentHintProfile;
          if (type === HintProfileTypes.User) {
            dispatch(hintApiSlice.endpoints.getUserHintProfile.initiate(id));
          }
        }
      },
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
          if (data.currentUserHintProfile) {
            dispatch(
              hintApiSlice.util.upsertQueryData(
                "getUserHintProfile",
                data.prefs.currentHintProfile.id,
                data.currentUserHintProfile,
              ),
            );
          }
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

export const getCurrentHintProfile = () => {
  console.log("Hey! Listen!");
  return userDataApiSlice.endpoints.getUserPrefs.useQueryState(undefined, {
    selectFromResult: ({ data }) =>
      data?.currentHintProfile ?? defaultCurrentHintProfile,
  });
};

export const setCurrentHintProfile = (profile: HintProfileBasicData) => {
  store.dispatch(
    userDataApiSlice.endpoints.updateUserPrefs.initiate({
      current_hint_profile_type: profile.type,
      current_hint_profile_id: profile.id,
    }),
  );
};
