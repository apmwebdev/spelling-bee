/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/app/store";
import { User } from "@/features/auth";
//Has to be a more specific import path to avoid a circular dependency
import { persistor } from "@/features/api/util";

type AuthState = {
  user: User | null;
  isGuest: boolean;
};

/**
 * Necessary so that user data can be removed from local storage and state
 * outside of the logout endpoint. Used by the baseQuery if it tries to run a
 * query and gets a 401.
 * @param dispatch
 */
export const logoutThunk = (dispatch: AppDispatch) => {
  dispatch(logoutReducer());
  persistor.remove("user");
  persistor.save("isGuest", "true");
};

const rehydrateAuthState = (): AuthState => {
  const storedUser = persistor.load<User>("user");
  const storedIsGuest = persistor.load<boolean>("isGuest");
  const authState: AuthState = {
    user: null,
    isGuest: storedIsGuest?.parsed === true,
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

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
