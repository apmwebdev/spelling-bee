/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { apiSlice, persistor } from "@/features/api";
import {
  AuthResetData,
  AuthUpdateData,
  LoginData,
  PasswordResetData,
  SignupData,
  User,
} from "@/features/auth/types";
import { BasicResponse } from "@/types";
import { startAppListening } from "@/app/listenerMiddleware";
import { isAnyOf } from "@reduxjs/toolkit";
import { loginReducer } from "@/features/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Creates a new account and sends confirmation email to provided email
     * address. */
    signup: builder.mutation<BasicResponse, SignupData>({
      query: (formData) => ({
        url: "/auth/signup",
        method: "POST",
        body: formData,
      }),
    }),
    /** Logs a user into their account. Doesn't work if they haven't confirmed
     * their email or their account is locked. */
    login: builder.mutation<User, LoginData>({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    /** Logs a user out and removes any data of theirs saved in the browser.
     * The removal of local data happens even if the server action fails. */
    logout: builder.mutation<BasicResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    /** Updates all account fields, including name, email, and password. If
     * updating a password, current password is also required. */
    updateAccount: builder.mutation<User, AuthUpdateData>({
      query: (formData) => ({
        url: "/auth/signup",
        method: "PATCH",
        body: formData,
      }),
    }),
    /** This only sends the password reset email, it doesn't actually reset the
     * user's password. */
    sendPasswordReset: builder.mutation<BasicResponse, AuthResetData>({
      query: (formData) => ({
        url: "/auth/password",
        method: "POST",
        body: formData,
      }),
    }),
    /** Submits a new password, along with the `reset_password_token` from Rails.
     * This is for resetting a password if the user has forgotten it. To change
     * a password normally, a user can use the `updateAccount` endpoint. Note
     * that resetting a password also unlocks the user account if it is locked.
     */
    resetPassword: builder.mutation<BasicResponse, PasswordResetData>({
      query: (formData) => ({
        url: "/auth/password",
        method: "PUT",
        body: formData,
      }),
    }),
    /** Users need to confirm their email addresses before they can log in. The
     * email with a link to do this is sent automatically on signup. This
     * endpoint resends that email if the user didn't receive it or didn't click
     * the confirmation link before it expired. */
    resendConfirmation: builder.mutation<BasicResponse, AuthResetData>({
      query: (formData) => ({
        url: "/auth/confirmation/resend",
        method: "POST",
        body: formData,
      }),
    }),
    /** User accounts are locked after a number of unsuccessful login attempts.
     * An email is then sent to the user with a link to unlock their account.
     * This endpoint is for resending that email if the user didn't receive it
     * or didn't follow the link before it expired. Note that unlocking an
     * account does not reset the password, it only allows the user to attempt
     * to log in again. */
    resendUnlock: builder.mutation<BasicResponse, AuthResetData>({
      query: (formData) => ({
        url: "/auth/unlock",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// Handle this here so that the behavior can be defined once for both login and
// account update.
startAppListening({
  matcher: isAnyOf(
    authApiSlice.endpoints.login.matchFulfilled,
    authApiSlice.endpoints.updateAccount.matchFulfilled,
  ),
  effect: ({ payload }, api) => {
    api.dispatch(loginReducer(payload));
    persistor.save("user", payload);
    // persistor.save("isGuest", false);
  },
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateAccountMutation,
  useSendPasswordResetMutation,
  useResetPasswordMutation,
  useResendConfirmationMutation,
  useResendUnlockMutation,
} = authApiSlice;
