import { FormEvent, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { LoginData } from "@/features/auth/types";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { isFetchBaseQueryErrorResponse } from "@/types";

export function Login({ redirectTo }: { redirectTo?: string }) {
  const user = useAppSelector(selectUser);
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  const [login] = useLoginMutation();

  const canSubmit = () => {
    return usernameValue !== "" && passwordValue !== "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      setMessageValue("");
      const formData: LoginData = {
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      };
      const response = await login(formData);
      if (
        isFetchBaseQueryErrorResponse(response) &&
        typeof response.error.data === "string"
      ) {
        setMessageValue(response.error.data);
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
        <div className="Auth_message">{messageValue}</div>
        <form id="Login_form" className="Auth_form" onSubmit={handleSubmit}>
          <fieldset className="Auth_fieldset">
            <label htmlFor="Login_usernameInput">Username:</label>
            <input
              type="text"
              id="Login_usernameInput"
              name="login-username"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value)}
            />
          </fieldset>
          <fieldset className="Auth_fieldset">
            <label htmlFor="Login_passwordInput">Password:</label>
            <input
              type="password"
              id="Login_passwordInput"
              name="login-password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
          </fieldset>
        </form>
        <button
          type="submit"
          form="Login_form"
          className="standardButton Auth_submit"
        >
          Log in
        </button>
      </div>
    );
  };

  return content();
}
