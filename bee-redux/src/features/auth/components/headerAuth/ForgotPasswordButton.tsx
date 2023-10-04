import * as Dialog from "@/components/radix-ui/radix-dialog";
import { ForgotPassword } from "@/features/auth/components/ForgotPassword";

export function ForgotPasswordButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">Reset Password</Dialog.Trigger>
      <Dialog.ContentWithPortal
        className="Auth_dialogContent"
        description="Enter your email to reset your password"
        title="Reset Password"
      >
        <ForgotPassword />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
