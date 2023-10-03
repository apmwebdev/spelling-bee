import { FormEvent, useState } from "react";
import { useSignupMutation } from "./authApiSlice";
import { isSignupError } from "@/types";

export function Signup() {
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  const [signup, { isLoading }] = useSignupMutation();
  const canSubmit = () => {
    if (
      !(
        emailValue &&
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
    setNameValue("");
    setPasswordValue("");
    setPasswordConfirmValue("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSubmit()) {
      const formData = {
        user: {
          email: emailValue,
          name: nameValue,
          password: passwordValue,
        },
      };
      try {
        const response = await signup(formData).unwrap();
        resetForm();
        setMessageValue(response.success);
      } catch (error) {
        console.error("Failed to save user: ", error);
        if (isSignupError(error)) {
          setMessageValue(error.data.error);
        }
      }
    }
  };

  return (
    <div className="Auth_container">
      <div className="Auth_message">{messageValue}</div>
      <form id="Signup_form" className="Auth_form" onSubmit={handleSubmit}>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_emailInput">Email:</label>
          <input
            type="email"
            id="Signup_emailInput"
            name="signup-email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </fieldset>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_nameInput">Name:</label>
          <input
            type="text"
            id="Signup_nameInput"
            name="signup-name"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
          />
        </fieldset>
        <hr className="Hr" />
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_passwordInput">Password:</label>
          <input
            type="password"
            id="Signup_passwordInput"
            name="signup-password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
          <label
            htmlFor="Signup_passwordInput"
            className="Auth_fieldDescription"
          >
            Must be 10 characters or more
          </label>
        </fieldset>
        <fieldset className="Auth_fieldset">
          <label htmlFor="Signup_passwordConfirmInput">Confirm password:</label>
          <input
            type="password"
            id="Signup_passwordConfirmInput"
            name="signup-password-confirm"
            value={passwordConfirmValue}
            onChange={(e) => setPasswordConfirmValue(e.target.value)}
          />
        </fieldset>
      </form>
      <button
        type="submit"
        form="Signup_form"
        className="standardButton Auth_submit"
      >
        Submit
      </button>
    </div>
  );
}
