/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { FormEvent, useState } from "react";
import { AuthMessageOutput, useLoginMutation } from "@/features/auth";
import { LoginData } from "@/features/auth/types/authTypes";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { errLog } from "@/util";
import { MoreActionsDropdown } from "@/features/auth/components/MoreActionsDropdown";
import { isBasicError, isFetchBaseQueryErrorResponse } from "@/features/api";

export function Login({
  passedInMessage,
}: {
  passedInMessage?: AuthMessageOutput;
}) {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const message = useStatusMessage({
    baseClass: "Auth_message",
    initial: passedInMessage,
  });
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailValue !== "" && passwordValue !== "" && !isLoading) {
      message.update("");
      const formData: LoginData = {
        user: {
          email: emailValue,
          password: passwordValue,
        },
      };
      try {
        /* Success logic for login is defined in authApiSlice and the parent
         * components to this form. Only the error case needs to be handled
         * here. */
        await login(formData).unwrap();
      } catch (err) {
        //TODO: Update this logic
        errLog("Failed to log in:", err);
        if (
          isFetchBaseQueryErrorResponse(err) &&
          typeof err.error.data === "string"
        ) {
          message.update(err.error.data, "Error");
        } else if (isBasicError(err)) {
          message.update(err.data.error, "Error");
        } else {
          message.update("Error logging in", "Error");
        }
      }
    }
  };

  return (
    <div className="Auth_container">
      <FormMessage {...message.output} />
      <form id="Login_form" className="Auth_form" onSubmit={handleSubmit}>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Login_emailInput">Email:</label>
          <input
            className="Auth_textInput"
            type="email"
            id="Login_emailInput"
            name="login-email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </fieldset>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Login_passwordInput">Password:</label>
          <input
            className="Auth_textInput"
            type="password"
            id="Login_passwordInput"
            name="login-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </fieldset>
      </form>
      <div className="Auth_actions">
        <MoreActionsDropdown />
        <button
          type="submit"
          form="Login_form"
          className="standardButton Auth_submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading" : "Log in"}
        </button>
      </div>
    </div>
  );
}
