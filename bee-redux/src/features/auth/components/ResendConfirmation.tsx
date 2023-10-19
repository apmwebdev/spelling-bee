import { FormEvent, useState } from "react";
import {
  AuthMessageOutput,
  useResendConfirmationMutation,
} from "@/features/auth";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { isBasicError } from "@/types";

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