export type User = {
  email: string;
  username: string;
  name: string;
};

export type LoginData = {
  user: {
    username: string;
    password: string;
  };
};

export type SignupData = {
  user: {
    email: string;
    username: string;
    name: string;
    password: string;
  };
};
