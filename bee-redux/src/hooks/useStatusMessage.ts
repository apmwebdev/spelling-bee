import { useState } from "react";
import classNames from "classnames/dedupe";
import {
  AuthMessageHook,
  AuthMessageOutput,
  AuthMessageUpdateFn,
} from "@/features/auth";
import { MessageStatus } from "@/types";

export const useStatusMessage = ({
  baseClass,
  initial,
}: {
  baseClass: string;
  initial?: AuthMessageOutput;
}): AuthMessageHook => {
  const [value, setValue] = useState(initial?.value ?? "");
  const [status, setStatus] = useState<MessageStatus>(
    initial?.status ?? "Disabled",
  );
  const classes = classNames({
    [baseClass]: true,
    SuccessText: status === "Success",
    WarningText: status === "Warning",
    ErrorText: status === "Error",
    DisabledText: status === "Disabled",
  });

  const update: AuthMessageUpdateFn = (
    message: string,
    newStatus?: MessageStatus,
  ) => {
    setValue(message);
    setStatus(newStatus ?? "Disabled");
  };

  const output: AuthMessageOutput = {
    value,
    status,
    classes,
  };

  return { update, output };
};
