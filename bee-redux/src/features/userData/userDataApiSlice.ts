import { apiSlice } from "../api/apiSlice";
import { UserBaseData, UserPrefsData } from "@/features/hints";

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrefs: builder.query<UserPrefsData, void>({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
    /**
     * For initial page load. Can fetch before puzzle loads. Combines
     * - getPrefs
     * - getHintProfiles
     * - getUserHintProfile, if applicable
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

export const { useGetPrefsQuery, useGetUserBaseDataQuery } = userDataApiSlice;
