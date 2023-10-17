import { MessageStatus } from "@/types";

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
