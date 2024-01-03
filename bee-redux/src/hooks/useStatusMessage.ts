/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useState } from "react";
import classNames from "classnames/dedupe";
import {
  AuthMessageHook,
  AuthMessageOutput,
  AuthMessageUpdateFn,
} from "@/features/auth";
import { MessageStatus } from "@/types/globalTypes";

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
