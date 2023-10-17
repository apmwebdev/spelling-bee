import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BaseQueryExtraOptions } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1",
  credentials: "include",
});

const baseQueryWithAuth = async (
  arg: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<BaseQueryFn>,
) => {
  const response = await baseQuery(arg, api, extraOptions);
  if (response.error) {
    console.error("arg:", arg, "error:", response);
  } else {
    console.log("arg:", arg, "response:", response);
  }
  //TODO: There's some sort of circular dependency with the authSlice that is
  // causing issues. But the logic for logging out on a 401 isn't great anyway.
  // This needs to be fixed.

  // if (response.error?.status === 401) {
  //   api.dispatch(logoutThunk);
  // }
  return response;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
