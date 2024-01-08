/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { AuthMessageOutput, AuthResetData } from "@/features/auth";
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
import { BasicResponse, isBasicError } from "@/features/api";

type SendMutation = MutationTrigger<
  MutationDefinition<
    AuthResetData,
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

export function SendAuthEmail({
  passedInMessage,
  sendFn,
}: {
  sendFn: SendMutation;
  passedInMessage?: AuthMessageOutput;
}) {
  const [emailValue, setEmailValue] = useState("");
  const message = useStatusMessage({
    baseClass: "Auth_message",
    initial: passedInMessage,
  });
  const formId = useId();
  const inputId = useId();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await sendFn({
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
        message.update("Error sending email", "Error");
      }
    }
  };

  return (
    <div className="Auth_container">
      <FormMessage {...message.output} />
      <form id={formId} className="Auth_form" onSubmit={handleSubmit}>
        <fieldset className="Auth_fieldset">
          <label className="Auth_fieldLabel" htmlFor={inputId}>
            Email:
          </label>
          <input
            type="email"
            className="Auth_textInput"
            id={inputId}
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
