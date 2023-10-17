import { AuthMessageOutput, Login, selectUser } from "@/features/auth";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

const CONFIRMED_MESSAGE: AuthMessageOutput = {
  value: "Email address confirmed successfully.",
  status: "Success",
  classes: "Auth_message SuccessText",
};

const UNLOCKED_MESSAGE: AuthMessageOutput = {
  value: "Account unlocked. You may now attempt to log in.",
  status: "Success",
  classes: "Auth_message SuccessText",
};

const DID_RESET_MESSAGE: AuthMessageOutput = {
  value: "Password reset successfully.",
  status: "Success",
  classes: "Auth_message SuccessText",
};

export function LoginRoute() {
  const user = useAppSelector(selectUser);
  const [searchParams] = useSearchParams();

  const message = (): AuthMessageOutput | undefined => {
    if (searchParams.get("message") === "confirmed") {
      return CONFIRMED_MESSAGE;
    }
    if (searchParams.get("message") === "unlocked") {
      return UNLOCKED_MESSAGE;
    }
    if (searchParams.get("message") === "did_reset") {
      return DID_RESET_MESSAGE;
    }
  };

  if (user) return <Navigate to="/puzzle/latest" />;
  return (
    <div className="Auth_route">
      <h2>Log In</h2>
      <Login passedInMessage={message()} />
    </div>
  );
}
