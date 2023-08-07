import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (formData) => ({
        url: "/signup",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: "/login",
        method: "POST",
        body: formData,
      }),
      transformResponse(response: any, meta: FetchBaseQueryMeta) {
        return {
          user: response.status.data.user,
        };
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
} = apiSlice;
