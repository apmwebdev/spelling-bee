import { apiSlice } from "../api/apiSlice";
import { RootState } from "../../app/store";

export const guessesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttempts: builder.query({
      query: (puzzleId) => ({
        url: `/user_puzzle_attempts/${puzzleId}`,
      }),
    }),
    getCurrentAttempts: builder.query({
      queryFn: async (_args, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const puzzleId = state.puzzle.data.id;
        if (puzzleId === 0) {
          return { error: { status: 404, data: "No puzzle loaded" } };
        }
        const response = await baseQuery(
          `/user_puzzle_attempts_for_puzzle/${puzzleId}`,
        );
        return response;
      },
    }),
    addAttempt: builder.mutation({
      query: () => ({
        url: "/user_puzzle_attempts/",
        method: "POST",
        body: {},
      }),
    }),
    deleteAttempt: builder.mutation({
      query: (attemptId) => ({
        url: `/user_puzzle_attempts/${attemptId}`,
        method: "DELETE",
      }),
    }),
    addGuess: builder.mutation({
      query: (guessData) => ({
        url: "/guesses",
        method: "POST",
        body: guessData,
      }),
    }),
  }),
});

export const {
  useGetCurrentAttemptsQuery,
  useLazyGetCurrentAttemptsQuery,
} = guessesApiSlice;
