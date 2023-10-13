import { FormEvent, useState } from "react";
import { AuthMessageOutput, useLoginMutation } from "@/features/auth";
import { LoginData } from "@/features/auth/types";
import { isFetchBaseQueryErrorResponse } from "@/types";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { MoreActions } from "@/features/auth/components/MoreActions";

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

  const [login] = useLoginMutation();

  const canSubmit = () => {
    return emailValue !== "" && passwordValue !== "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      message.update("");
      const formData: LoginData = {
        user: {
          email: emailValue,
          password: passwordValue,
        },
      };
      const response = await login(formData);
      if (
        isFetchBaseQueryErrorResponse(response) &&
        typeof response.error.data === "string"
      ) {
        message.update(response.error.data, "Error");
        console.log(response);
        return;
      }
    }
  };

  const content = () => {
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
          {/*<ForgotPasswordButton />*/}
          <button
            type="submit"
            form="Login_form"
            className="standardButton Auth_submit"
          >
            Log in
          </button>
        </div>
        <MoreActions />
      </div>
    );
  };

  return content();
}
