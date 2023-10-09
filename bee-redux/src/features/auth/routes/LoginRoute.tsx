import { AuthMessageOutput, Login, selectUser } from "@/features/auth";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

const confirmedMessage: AuthMessageOutput = {
  value: "Email address confirmed successfully.",
  classes: "Auth_message SuccessText",
};

export function LoginRoute() {
  const user = useAppSelector(selectUser);
  const [searchParams] = useSearchParams();

  const message = (): AuthMessageOutput | undefined => {
    //TODO: Make URL pattern and/or message into constants?
    if (searchParams.get("message") === "confirmed") {
      return confirmedMessage;
    }
  };

  if (user) return <Navigate to="/puzzle/latest" />;
  return (
    <div className="Auth_route">
      <Login passedInMessage={message()} />
    </div>
  );
}
