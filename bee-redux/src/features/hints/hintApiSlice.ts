import { apiSlice } from "../api/apiSlice";

export const hintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHintProfiles: builder.query({}),
    getUserHintProfiles: builder.query({}),
    createUserHintProfile: builder.mutation({}),

  }),
});
