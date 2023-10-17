import { useSendPasswordResetMutation } from "@/features/auth";
import { SendAuthEmail } from "@/features/auth/components/SendAuthEmail";

export function SendPasswordResetRoute() {
  const [sendPasswordReset] = useSendPasswordResetMutation();

  return (
    <div className="Auth_route">
      <h2>Reset Password</h2>
      <p>
        Submit your email address below. If there is an account for that email
        address, an email will be sent to it with a password recovery link.
      </p>
      <SendAuthEmail sendFn={sendPasswordReset} />
    </div>
  );
}
