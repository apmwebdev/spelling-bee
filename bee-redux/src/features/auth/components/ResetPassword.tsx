/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { FormEvent, useState } from "react";

export function ResetPassword() {
  const [emailValue, setEmailValue] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    //TODO: Implement this? If not, is it still needed?
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
