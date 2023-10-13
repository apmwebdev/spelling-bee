import { useSearchParams } from "react-router-dom";
import { AuthMessageOutput, useResendUnlockMutation } from "@/features/auth";
import { ResendEmail } from "@/features/auth/components/ResendEmail";

const unlockErrorMessage: AuthMessageOutput = {
  value:
    "Error when attempting to unlock account. Click the link in your email to try again, or resend the unlock email below.",
  status: "Error",
  classes: "Auth_message ErrorText",
};
export function ResendUnlockRoute() {
  const [searchParams] = useSearchParams();
  const [resend] = useResendUnlockMutation();
  const message = (): AuthMessageOutput | undefined => {
    if (searchParams.get("message") === "unlock_error") {
      return unlockErrorMessage;
    }
  };

  return (
    <div className="Auth_route">
      <h2>Resend Unlock Email</h2>
      <ResendEmail resend={resend} passedInMessage={message()} />
    </div>
  );
}
