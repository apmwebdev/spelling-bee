/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { authApiSlice } from "./authApiSlice";
import { User } from "../types/authTypes";
//Has to be a more specific import path to avoid a circular dependency
import { persistor } from "@/features/api/util";
import { startAppListening } from "@/app/listenerMiddleware";

type AuthState = {
  user: User | null;
  isGuest: boolean;
};

const rehydrateAuthState = (): AuthState => {
  const storedUser = persistor.load<any>("user");
  // const storedIsGuest = persistor.load<boolean>("isGuest");
  const authState: AuthState = {
    user: null,
    isGuest: false,
    // isGuest: storedIsGuest?.parsed === true,
  };
  if (storedUser) {
    const maybeUser = storedUser.parsed;
    //Check that the stored user is *actually* the proper type
    if (
      typeof maybeUser.email === "string" &&
      typeof maybeUser.name === "string"
    ) {
      authState.user = maybeUser;
    }
  }
  return authState;
};

const authSlice = createSlice({
  name: "auth",
  initialState: rehydrateAuthState(),
  reducers: {
    loginReducer: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.isGuest = false;
    },
    logoutReducer: (state) => {
      state.user = null;
      state.isGuest = true;
    },
  },
  extraReducers: (builder) => {},
});

export const { loginReducer, logoutReducer } = authSlice.actions;

/**
 * Necessary so that user data can be removed from local storage and state
 * outside of the logout endpoint. Used by the baseQuery if it tries to run a
 * query and gets a 401.
 * @param dispatch
 */
startAppListening({
  type: "auth/baseQueryLogout",
  effect: (_arg, api) => {
    api.dispatch(logoutThunk(false));
  },
});

export const logoutThunk = createAsyncThunk(
  "auth/logoutThunk",
  (withEndpoint: boolean = true, api) => {
    const state = api.getState() as RootState;
    const auth = selectAuth(state);
    if (auth.user || !auth.isGuest) {
      api.dispatch(logoutReducer());
      if (withEndpoint) {
        api.dispatch(authApiSlice.endpoints.logout.initiate(undefined));
      }
    }
    persistor.remove("user");
    persistor.remove("currentHintProfile");
    persistor.remove("userPrefs");
  },
);

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
