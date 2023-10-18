import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BaseQueryExtraOptions } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
//Has to be a more specific import path to avoid a circular dependency
import { logoutThunk } from "@/features/auth/api/authSlice";

const BASE_QUERY_URL =
  import.meta.env.VITE_BACKEND_BASE_URL + import.meta.env.VITE_BACKEND_API_PATH;
console.log(BASE_QUERY_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_QUERY_URL,
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
  if (response.error?.status === 401) {
    api.dispatch(logoutThunk);
  }
  return response;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
