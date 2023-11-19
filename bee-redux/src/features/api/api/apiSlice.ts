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
import { logoutThunk } from "@/features/auth/api/authSlice";
import { devLog } from "@/util";

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
  const response = await baseQuery(arg, api, extraOptions);
  if (response.error) {
    devLog("arg:", arg, "error:", response);
  } else {
    devLog("arg:", arg, "response:", response);
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
