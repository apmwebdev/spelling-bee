import { apiSlice } from "@/features/api";

import {
  AuthUpdateData,
  LoginData,
  ResendEmailData,
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
    resendConfirmation: builder.mutation<BasicResponse, ResendEmailData>({
      query: (email) => ({
        url: "/auth/confirmation/resend",
        method: "POST",
        body: email,
      }),
    }),
    resendUnlock: builder.mutation<BasicResponse, ResendEmailData>({
      query: (email) => ({
        url: "/auth/unlock",
        method: "POST",
        body: email,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateAccountMutation,
  useResendConfirmationMutation,
  useResendUnlockMutation,
} = authApiSlice;
