import { FormEvent, useState } from "react";
import {
  AuthMessageOutput,
  useResendConfirmationMutation,
} from "@/features/auth";
import { useMessage } from "@/features/auth/hooks/useMessage";
import { Message } from "@/features/auth/components/Message";
import { isBasicError } from "@/types";

export function ResendConfirmation({
  passedInMessage,
}: {
  passedInMessage?: AuthMessageOutput;
}) {
  const [emailValue, setEmailValue] = useState("");
  const message = useMessage(passedInMessage);
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
      message.update(response.success, "success");
    } catch (err) {
      if (isBasicError(err)) {
        message.update(err.data.error, "error");
      } else {
        message.update("Error", "error");
      }
    }
  };

  return (
    <div className="Auth_container">
      <Message {...message.output} />
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
