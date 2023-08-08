import { apiSlice } from "../api/apiSlice";

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrefs: builder.query({
      query: () => ({
        url: "/userPrefs",
      }),
    }),
  }),
});

export const { useGetPrefsQuery } = userDataApiSlice;
