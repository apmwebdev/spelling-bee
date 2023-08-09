import { apiSlice } from "../api/apiSlice";

export const puzzleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPuzzle: builder.query({
      query: (identifier: string) => ({
        url: `/puzzles/${identifier}`,
      }),
    }),
  }),
});

export const { useGetPuzzleQuery } = puzzleApiSlice;
