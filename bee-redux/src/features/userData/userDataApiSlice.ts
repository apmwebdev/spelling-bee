import { apiSlice } from "../api/apiSlice";

export const userDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrefs: builder.query({
      query: () => ({
        url: "/user_prefs",
      }),
    }),
  }),
});

export const { useGetPrefsQuery } = userDataApiSlice;
