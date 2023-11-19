/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useSearchParams } from "react-router-dom";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { FormEvent } from "react";
import { usePasswordValidation } from "@/features/auth/hooks/usePasswordValidation";
import { PasswordFields } from "@/features/auth/components/PasswordFields";
import { PasswordResetData, useResetPasswordMutation } from "@/features/auth";
import { isBasicError } from "@/types";
import { MoreActions } from "@/features/auth/components/MoreActions";

export function ResetPasswordRoute() {
  const [searchParams] = useSearchParams();
  /* The component returns an error if token is either blank or null, so make it
   * blank so that it's a string to satisfy TypeScript */
  const token = searchParams.get("token") ?? "";
  const message = useStatusMessage({
    baseClass: "Auth_message",
  });
  const { passwordState, passwordConfirmState } = usePasswordValidation({
    allowBlanks: false,
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const validateForm = () => {
    message.update("");
    const passwordIsValid = passwordState.validateCurrent();
    const passwordConfirmIsValid = passwordConfirmState.validateCurrent();
    return token && passwordIsValid && passwordConfirmIsValid && !isLoading;
  };

  const resetForm = () => {
    passwordState.setValue("");
    passwordConfirmState.setValue("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formData: PasswordResetData = {
        user: {
          reset_password_token: token,
          password: passwordState.value,
          password_confirmation: passwordConfirmState.value,
        },
      };
      try {
        const response = await resetPassword(formData).unwrap();
        resetForm();
        message.update(response.success, "Success");
      } catch (err) {
        console.error("Failed to save password:", err);
        if (isBasicError(err)) {
          message.update(err.data.error, "Error");
        } else {
          message.update("Failed to save password", "Error");
        }
      }
    }
  };

  if (!token) return <div>Error: No token</div>;
  return (
    <div className="Auth_route">
      <h2>Reset Password</h2>
      <FormMessage {...message.output} />
      <div className="Auth_container">
        <form
          id="PasswordResetForm"
          className="Auth_form"
          onSubmit={handleSubmit}
        >
          <PasswordFields
            passwordState={passwordState}
            passwordConfirmState={passwordConfirmState}
          />
        </form>
        <div className="Auth_actions">
          <MoreActions />
          <button
            type="submit"
            form="PasswordResetForm"
            className="standardButton Auth_submit"
          >
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}
