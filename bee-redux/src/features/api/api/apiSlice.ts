/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BaseQueryExtraOptions } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
//Has to be a more specific import path to avoid a circular dependency
import { devLog } from "@/util";
import { RootState } from "@/app/store";
import { throttle } from "@/features/api";

const BASE_QUERY_URL =
  import.meta.env.VITE_BACKEND_BASE_URL + import.meta.env.VITE_BACKEND_API_PATH;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_QUERY_URL,
  credentials: "include",
});

const baseQueryWithAuth = async (
  arg: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<BaseQueryFn>,
) => {
  devLog("arg:", arg);
  const state = api.getState() as RootState;
  const argUrl = typeof arg === "string" ? arg : arg.url;
  if (
    !state.auth.user &&
    !state.auth.isGuest &&
    argUrl !== "/auth/check" &&
    argUrl !== "/auth/logout"
  ) {
    const authCheck = throttle({
      key: "authCheck",
      delay: 1000,
      callback: () => baseQuery("/auth/check", api, extraOptions),
    });
    if (authCheck.didRun) {
      const authCheckResponse = await authCheck.value;
      if (authCheckResponse.error) {
        devLog("Auth check returned error. Log out", arg, authCheckResponse);
        api.dispatch({ type: "auth/baseQueryLogout" });
      }
    }
  }
  const response = await baseQuery(arg, api, extraOptions);
  if (response.error) {
    devLog("response: arg:", arg, "error:", response);
  } else {
    devLog("response: arg:", arg, "data:", response);
  }
  if (
    response.error?.status === 401 &&
    !state.auth.isGuest &&
    argUrl !== "/auth/check" &&
    argUrl !== "/auth/logout"
  ) {
    devLog("Received error for original query. Log out", arg);
    api.dispatch({ type: "auth/baseQueryLogout" });
  }
  return response;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
