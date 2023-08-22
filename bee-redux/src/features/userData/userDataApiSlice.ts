import { apiSlice } from "../api/apiSlice";
import {
  defaultCurrentHintProfile,
  HintProfileBasicData,
  UserBaseData,
  UserPrefsData,
  UserPrefsFormData,
} from "@/features/hints";
import { store } from "@/app/store";

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserPrefs: builder.query<UserPrefsData, void>({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
    updateUserPrefs: builder.mutation<UserPrefsData, UserPrefsFormData>({
      query: (formData) => ({
        url: "/user_prefs",
        method: "PATCH",
        body: formData,
      }),
    }),
    /**
     * For initial page load. Can fetch before puzzle loads. Combines
     * - getPrefs
     * - getHintProfiles from hintApiSlice
     * - getUserHintProfile, if applicable, from hintApiSlice
     */
    getUserBaseData: builder.query<UserBaseData, void>({
      query: () => ({
        url: "/user_base_data",
      }),
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
