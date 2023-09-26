import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/app/store";
import { authApiSlice } from "./authApiSlice";
import { User } from "@/features/auth/types";
import { startAppListening } from "@/app/listenerMiddleware";
import { persister } from "@/features/api";

type AuthState = {
  user: User | null;
  isGuest: boolean;
};

const rehydrateAuthState = (): AuthState => {
  const storedUser = persister.load("user");
  const storedIsGuest = persister.load("isGuest");
  const authState: AuthState = {
    user: null,
    isGuest: storedIsGuest?.parsed === true,
  };
  if (storedUser) {
    const maybeUser = storedUser.parsed;
    if (
      typeof maybeUser.email === "string" &&
      typeof maybeUser.name === "string" &&
      typeof maybeUser.username === "string"
    ) {
      authState.user = maybeUser;
    }
  }
  return authState;
};

/**
 * Necessary so that user data can be removed from local storage and state
 * outside of the logout endpoint. Used by the baseQuery if it tries to run a
 * query and gets a 401.
 * @param dispatch
 */
export const logoutThunk = (dispatch: AppDispatch) => {
  dispatch(logoutReducer());
  persister.remove("user");
  persister.save("isGuest", "true");
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

startAppListening({
  matcher: authApiSlice.endpoints.login.matchFulfilled,
  effect: ({ payload }, api) => {
    api.dispatch(loginReducer(payload));
    persister.save("user", payload);
    persister.save("isGuest", false);
  },
});

startAppListening({
  matcher: authApiSlice.endpoints.logout.matchFulfilled,
  effect: (_action, api) => {
    api.dispatch(logoutThunk);
    persister.remove("currentHintProfile");
    persister.remove("userPrefs");
  },
});

export default authSlice.reducer;
