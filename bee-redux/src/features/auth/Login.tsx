import { FormEvent, useState } from "react";
import { useLoginMutation } from "./authApiSlice";

export function Login() {
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [login] = useLoginMutation();

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

  const logInAsAdmin = async () => {
    try {
      const response = await login({
        user: { username: "admin", password: "admin1" },
      });
      // if (response.error) {
      //   console.log("Error:", response.error);
      // }
    } catch (error) {
      console.log("Failed to log in: ", error);
    }
  };

  return (
    <div className="Login">
      <form id="LoginForm" onSubmit={handleSubmit}>
        <div className="LoginUsernameContainer">
          <label htmlFor="LoginUsername">Username:</label>
          <input
            type="text"
            id="LoginUsername"
            name="login-username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <div className="LoginPasswordContainer">
          <label htmlFor="LoginPassword">Password:</label>
          <input
            type="password"
            id="LoginPassword"
            name="login-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      <button type="button" onClick={logInAsAdmin}>
        Log in as admin
      </button>
    </div>
  );
}
