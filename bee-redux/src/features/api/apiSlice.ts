import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/v1",
    // prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set("Authorization", `Bearer ${token}`);
      // }
      // return headers;
    // },
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
        console.log("Response: ", response);
        console.log("Meta: ", meta);
        return {
          user: response.status.data.user,
          auth_header: meta
            ? meta.response?.headers.get("Authorization")
            : null,
        };
      },
    }),
    getPuzzle: builder.query({
      query: (identifier) => `/puzzles/${identifier}`,
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetPuzzleQuery,
} = apiSlice;
