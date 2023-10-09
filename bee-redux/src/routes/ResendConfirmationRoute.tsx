import { ResendConfirmation } from "@/features/auth/components/ResendConfirmation";
import { useSearchParams } from "react-router-dom";
import { AuthMessageOutput } from "@/features/auth";

const confirmationErrorMessage: AuthMessageOutput = {
  value:
    "Error when attempting to confirm email address. Click the link in your email to try again, or resend the confirmation email below.",
  classes: "Auth_message ErrorText",
};
export function ResendConfirmationRoute() {
  const [searchParams] = useSearchParams();
  const message = (): AuthMessageOutput | undefined => {
    if (searchParams.get("message") === "confirmation_error") {
      return confirmationErrorMessage;
    }
  };
  return (
    <div className="Auth_route">
      <ResendConfirmation passedInMessage={message()} />
    </div>
  );
}
