import { apiSlice } from "@/features/api";

import {
  AuthResetData,
  AuthUpdateData,
  LoginData,
  PasswordResetData,
  SignupData,
  User,
} from "@/features/auth";
import { BasicResponse } from "@/types";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<BasicResponse, SignupData>({
      query: (formData) => ({
        url: "/auth/signup",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation<User, LoginData>({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<BasicResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
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
     * a password normally, a user can use the `updateAccount` endpoint. */
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
