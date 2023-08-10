import { apiSlice } from "../api/apiSlice";

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrefs: builder.query({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
    getUserPuzzleData: builder.query({
      query: (puzzleId: number) => ({
        url: `/user_puzzle_data/${puzzleId}`,
      }),
    }),
  }),
});

export const { useGetPrefsQuery } = userDataApiSlice;
