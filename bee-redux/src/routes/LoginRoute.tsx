import { AuthMessageOutput, Login } from "@/features/auth";
import { useSearchParams } from "react-router-dom";

const confirmedMessage: AuthMessageOutput = {
  value: "Email address confirmed successfully.",
  classes: "Auth_message SuccessText",
};

export function LoginRoute() {
  const [searchParams] = useSearchParams();
  const message = (): AuthMessageOutput | undefined => {
    //TODO: Make URL pattern and/or message into constants?
    if (searchParams.get("message") === "confirmed") {
      return confirmedMessage;
    }
  };

  return (
    <div className="Auth_route">
      <Login redirectTo="../puzzle/latest" passedInMessage={message()} />
    </div>
  );
}
