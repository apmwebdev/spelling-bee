import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/app/store";
import { authApiSlice } from "./authApiSlice";

export interface User {
  email: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isGuest: boolean;
}

const rehydrateAuthState = (): AuthState => {
  const storedUser = localStorage.getItem("user");
  const storedIsGuest = localStorage.getItem("isGuest");
  const authState: AuthState = {
    user: null,
    isGuest: storedIsGuest === "true" || false,
  };
  if (storedUser) {
    try {
      const maybeUser = JSON.parse(storedUser);
      if (
        typeof maybeUser.email === "string" &&
        typeof maybeUser.name === "string" &&
        typeof maybeUser.username === "string"
      ) {
        authState.user = maybeUser;
      }
    } catch {}
  }
  return authState;
};

export const logoutThunk = (dispatch: AppDispatch) => {
  dispatch(logoutLocal);
  localStorage.removeItem("user");
  try {
    localStorage.setItem("isGuest", "true");
  } catch (err) {
    console.log("Couldn't save 'isGuest' to local storage:", err);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: rehydrateAuthState(),
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.isGuest = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.status.data.user;
          state.isGuest = false;
        },
      )
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isGuest = true;
      });
  },
});

export const { logoutLocal } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
