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
import {
  AuthMessageOutput,
  useResendConfirmationMutation,
} from "@/features/auth";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";

import { isBasicError } from "@/features/api";

export function ResendConfirmation({
  passedInMessage,
}: {
  passedInMessage?: AuthMessageOutput;
}) {
  const [emailValue, setEmailValue] = useState("");
  const message = useStatusMessage({
    baseClass: "Auth_message",
    initial: passedInMessage,
  });
  const [resend] = useResendConfirmationMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await resend({
        user: {
          email: emailValue,
        },
      }).unwrap();
      setEmailValue("");
      message.update(response.success, "Success");
    } catch (err) {
      if (isBasicError(err)) {
        message.update(err.data.error, "Error");
      } else {
        message.update("Error", "Error");
      }
    }
  };

  return (
    <div className="Auth_container">
      <FormMessage {...message.output} />
      <form
        id="ResendConfirmation_form"
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
            id="ResendConfirmation_emailInput"
            name="email"
            value={emailValue}
            required
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </fieldset>
      </form>
      <button
        type="submit"
        form="ResendConfirmation_form"
        className="standardButton Auth_submit"
      >
        Send
      </button>
    </div>
  );
}
