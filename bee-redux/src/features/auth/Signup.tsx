import { FormEvent, useState } from "react";
import { useSignupMutation } from "./authApiSlice";

export function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");

  const [signup, { isLoading }] = useSignupMutation();
  const canSubmit = () => {
    if (
      !(
        emailValue &&
        usernameValue &&
        nameValue &&
        passwordValue &&
        passwordConfirmValue &&
        !isLoading
      )
    ) {
      return false;
    }
    return passwordValue === passwordConfirmValue;
  };

  const resetForm = () => {
    setEmailValue("");
    setUsernameValue("");
    setNameValue("");
    setPasswordValue("");
    setPasswordConfirmValue("");
  };

  const populateSampleData = () => {
    setEmailValue("admin@admin.com");
    setUsernameValue("admin");
    setNameValue("Admin");
    setPasswordValue("admin1");
    setPasswordConfirmValue("admin1");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      const formData = {
        user: {
          email: emailValue,
          username: usernameValue,
          name: nameValue,
          password: passwordValue,
        },
      };
      try {
        await signup(formData).unwrap();
        resetForm();
      } catch (error) {
        console.error("Failed to save user: ", error);
      }
    }
  };

  return (
    <div className="sb-signup">
      <form className="sb-signup-form" onSubmit={handleSubmit}>
        <div className="signup-email-container">
          <label htmlFor="signup-email">Email:</label>
          <input
            type="email"
            id="signup-email"
            name="signup-email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </div>
        <div className="signup-username-container">
          <label htmlFor="signup-username">Username:</label>
          <input
            type="text"
            id="signup-username"
            name="signup-username"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
        <div className="signup-name-container">
          <label htmlFor="signup-name">Name:</label>
          <input
            type="text"
            id="signup-name"
            name="signup-name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </div>
        <div className="signup-password-container">
          <label htmlFor="signup-password">Password:</label>
          <input
            type="password"
            id="signup-password"
            name="signup-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </div>
        <div className="signup-password-confirm-container">
          <label htmlFor="signup-password-confirm">Confirm password:</label>
          <input
            type="password"
            id="signup-password-confirm"
            name="signup-password-confirm"
            value={passwordConfirmValue}
            onChange={(e) => setPasswordConfirmValue(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <button type="button" onClick={populateSampleData}>
        Populate sample data
      </button>
    </div>
  );
}
