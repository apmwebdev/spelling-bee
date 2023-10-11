import * as Dialog from "@/components/radix-ui/radix-dialog";
import { ResetPassword } from "@/features/auth/components/ResetPassword";

export function ForgotPasswordButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">Reset Password</Dialog.Trigger>
      <Dialog.ContentWithPortal
        className="Auth_dialogContent"
        description="Enter your email to reset your password"
        title="Reset Password"
      >
        <ResetPassword />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
