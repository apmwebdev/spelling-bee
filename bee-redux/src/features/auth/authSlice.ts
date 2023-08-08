import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type { RootState } from "../../app/store";
import { authApiSlice } from "./authApiSlice";

export interface User {
  email: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
}

const InitialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: InitialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    populateUserDataFromStorage: (state) => {
      if (state.user) return;
      const storedUser = localStorage.getItem("user");
      console.log("storedUser:", storedUser);
      if (storedUser) {
        console.log("storedUser is true");
        state.user = JSON.parse(storedUser);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          console.log(payload);
          const userData = payload.status.data.user;
          state.user = userData;
          try {
            localStorage.setItem("user", JSON.stringify(userData));
          } catch (err) {
            console.log(
              "Couldn't save public user info to local storage:",
              err,
            );
          }
        },
      )
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      });
  },
});

export const { logout, populateUserDataFromStorage } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
