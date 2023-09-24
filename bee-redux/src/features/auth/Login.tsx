import { FormEvent, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { LoginData } from "@/features/auth/types";

export function Login() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [login] = useLoginMutation();

  const canSubmit = () => {
    return usernameValue !== "" && passwordValue !== "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      const formData: LoginData = {
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      };
      try {
        login(formData);
      } catch (error) {
        console.log("Failed to log in: ", error);
      }
    }
  };

  return (
    <div className="Auth_container">
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
}
