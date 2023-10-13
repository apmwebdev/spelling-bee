import { AuthMessageOutput, ResendEmailData } from "@/features/auth";
import { FormEvent, useId, useState } from "react";
import { useStatusMessage } from "@/hooks/useStatusMessage";
import { FormMessage } from "@/components/FormMessage";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from "@reduxjs/toolkit/query";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { BasicResponse, isBasicError } from "@/types";

type ResendMutation = MutationTrigger<
  MutationDefinition<
    ResendEmailData,
    (
      arg: string | FetchArgs,
      api: BaseQueryApi,
      extraOptions: {},
    ) => Promise<
      QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
    >,
    "User",
    BasicResponse,
    "api"
  >
>;

export function ResendEmail({
  passedInMessage,
  resend,
}: {
  resend: ResendMutation;
  passedInMessage?: AuthMessageOutput;
}) {
  const [emailValue, setEmailValue] = useState("");
  const message = useStatusMessage({
    baseClass: "Auth_message",
    initial: passedInMessage,
  });
  const formId = useId();

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
        message.update("Error resending email", "Error");
      }
    }
  };

  return (
    <div className="Auth_container">
      <FormMessage {...message.output} />
      <form id={formId} className="Auth_form" onSubmit={handleSubmit}>
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
            name="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            required
          />
        </fieldset>
      </form>
      <button
        type="submit"
        form={formId}
        className="standardButton Auth_submit"
      >
        Send
      </button>
    </div>
  );
}
