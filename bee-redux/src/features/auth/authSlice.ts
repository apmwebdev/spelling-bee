import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type { RootState } from "../../app/store";

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
        },
      )
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
