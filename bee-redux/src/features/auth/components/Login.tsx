import { FormEvent, useState } from "react";
import { AuthMessageOutput, useLoginMutation } from "@/features/auth";
import { LoginData } from "@/features/auth/types";
import { isBasicError, isFetchBaseQueryErrorResponse } from "@/types";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { devLog } from "@/util";
import { MoreActionsDropdown } from "@/features/auth/components/MoreActionsDropdown";

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
        devLog("Failed to log in:", err);
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
