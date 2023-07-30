import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import type { RootState } from "../../app/store";

export interface User {
  email: string;
  username: string;
  name: string;
}

type AuthState = {
  user: User | null;
  token: string | null;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        console.log("Payload: ", payload);
        if (payload.auth_header) {
          state.token = payload.auth_header;
        }
        state.user = payload.user;
      },
    );
  },
});

export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
