import { FormEvent, useState } from "react";

export function ForgotPassword() {
  const [emailValue, setEmailValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="Auth_container">
      <form
        id="ForgotPassword_form"
        className="Auth_form"
        onSubmit={handleSubmit}
      >
        <fieldset className="Auth_fieldset">
          <label
            className="Auth_fieldLabel"
            htmlFor="ResendConfirmation_emailInput"
          >
            Email:
          </label>
          <input
            type="email"
            className="Auth_textInput"
            id="ForgotPassword_emailInput"
            name="email"
            value={emailValue}
            required
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </fieldset>
      </form>
      <button
        type="submit"
        form="ForgotPassword_form"
        className="standardButton Auth_submit"
      >
        Send
      </button>
    </div>
  );
}
