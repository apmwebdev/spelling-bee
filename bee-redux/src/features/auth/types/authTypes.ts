/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { MessageStatus } from "@/types/globalTypes";

export type User = {
  email: string;
  name: string;
};

export type LoginData = {
  user: {
    email: string;
    password: string;
  };
};

export type SignupData = {
  user: {
    email: string;
    name: string;
    password: string;
    password_confirmation: string;
  };
};

export type AuthResetData = {
  user: {
    email: string;
  };
};

export type AuthMessageUpdateFn = (
  message: string,
  status?: MessageStatus,
) => void;

export type AuthMessageOutput = {
  value: string;
  status: MessageStatus;
  classes: string;
};

export type AuthMessageHook = {
  update: AuthMessageUpdateFn;
  output: AuthMessageOutput;
};

export type AuthUpdateData = {
  user: {
    email?: string;
    name?: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
  };
};

export type PasswordResetData = {
  user: {
    password: string;
    password_confirmation: string;
    reset_password_token: string;
  };
};
