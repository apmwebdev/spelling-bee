import { useState } from "react";
import classNames from "classnames/dedupe";
import {
  AuthMessageHook,
  AuthMessageOutput,
  AuthMessageUpdate,
} from "@/features/auth";

export const useMessage = (init?: AuthMessageOutput): AuthMessageHook => {
  const [value, setValue] = useState(init?.value ?? "");
  const [classes, setClasses] = useState(init?.classes ?? "Auth_message");

  const update: AuthMessageUpdate = (
    message: string,
    status?: "success" | "error",
  ) => {
    setValue(message);
    setClasses(
      classNames({
        Auth_message: true,
        SuccessText: !status || status === "success",
        ErrorText: status === "error",
      }),
    );
  };

  const output: AuthMessageOutput = {
    value,
    classes,
  };

  return { update, output };
};
