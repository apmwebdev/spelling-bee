import { useSearchParams } from "react-router-dom";
import {
  AuthMessageOutput,
  useResendConfirmationMutation,
} from "@/features/auth";
import { SendAuthEmail } from "@/features/auth/components/SendAuthEmail";

const confirmationErrorMessage: AuthMessageOutput = {
  value:
    "Error when attempting to confirm email address. Click the link in your email to try again, or resend the confirmation email below.",
  status: "Error",
  classes: "Auth_message ErrorText",
};
export function ResendConfirmationRoute() {
  const [searchParams] = useSearchParams();
  const [resend] = useResendConfirmationMutation();
  const message = (): AuthMessageOutput | undefined => {
    if (searchParams.get("message") === "confirmation_error") {
      return confirmationErrorMessage;
    }
  };

  return (
    <div className="Auth_route">
      <h2>Resend Confirmation Email</h2>
      <SendAuthEmail sendFn={resend} passedInMessage={message()} />
    </div>
  );
}
