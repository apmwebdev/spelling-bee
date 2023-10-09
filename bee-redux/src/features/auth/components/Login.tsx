import { FormEvent, useState } from "react";
import { AuthMessageOutput, useLoginMutation } from "@/features/auth";
import { LoginData } from "@/features/auth/types";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/api/authSlice";
import { isFetchBaseQueryErrorResponse } from "@/types";
import { ForgotPasswordButton } from "@/features/auth/components/headerAuth/ForgotPasswordButton";
import { useMessage } from "@/features/auth/hooks/useMessage";
import { Message } from "@/features/auth/components/Message";

export function Login({
  redirectTo,
  passedInMessage,
}: {
  redirectTo?: string;
  passedInMessage?: AuthMessageOutput;
}) {
  const user = useAppSelector(selectUser);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const message = useMessage(passedInMessage);

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
        message.update(response.error.data, "error");
        console.log(response);
        return;
      }
    }
  };

  /*
   * React Router's useNavigate hook is very buggy (c.f.
   * https://github.com/remix-run/react-router/issues/10579). I couldn't get it
   * working when attempting to use it in the handleSubmit method above to
   * redirect the user after a successful login, so I'm using the Navigate
   * component here instead. The 'redirectTo' prop is optional because the login
   * component isn't always a standalone page, but can also be a popup opened
   * from the header, and in that scenario no redirect is necessary.
   */
  const content = () => {
    if (user && redirectTo) {
      return <Navigate to={redirectTo} />;
    }

    return (
      <div className="Auth_container">
        <Message {...message.output} />
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
          <ForgotPasswordButton />
          <button
            type="submit"
            form="Login_form"
            className="standardButton Auth_submit"
          >
            Log in
          </button>
        </div>
      </div>
    );
  };

  return content();
}
