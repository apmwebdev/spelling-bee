import { FormEvent, useState } from "react";
import { useLoginMutation } from "../api/apiSlice";

export function Login() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const resetForm = () => {
    setUsernameValue("");
    setPasswordValue("");
  };

  const canSubmit = () => {
    return usernameValue && passwordValue;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      const formData = {
        user: {
          username: usernameValue,
          password: passwordValue,
        },
      };
      try {
        await login(formData).then((response) => console.log(response));
      } catch (error) {
        console.log("Failed to log in: ", error);
      }
    }
  };

  return (
    <div className="sb-login">
      <form className="sb-login-form" onSubmit={handleSubmit}>
        <div className="login-username-container">
          <label htmlFor="login-username">Username:</label>
          <input
            type="text"
            id="login-username"
            name="login-username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <div className="login-username-container">
          <label htmlFor="login-username">Password:</label>
          <input
            type="password"
            id="login-password"
            name="login-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
