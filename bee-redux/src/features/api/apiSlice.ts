import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BaseQueryExtraOptions } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { logout, populateUserDataFromStorage } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1",
  credentials: "include",
});

const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<BaseQueryFn>,
) => {
  // @ts-ignore
  if (!api.getState().auth?.user) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      api.dispatch(populateUserDataFromStorage());
    }
  }
  const result = await baseQuery(args, api, extraOptions);
  // @ts-ignore
  if (result?.error?.originalStatus === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({}),
});
