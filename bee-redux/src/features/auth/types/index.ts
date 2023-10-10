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

export type ResendConfirmationData = {
  user: {
    email: string;
  };
};

export type AuthMessageData = (
  message: string,
  status?: "success" | "error",
) => void;

export type AuthMessageOutput = {
  value: string;
  classes: string;
};

export type AuthMessageHook = {
  update: AuthMessageData;
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
