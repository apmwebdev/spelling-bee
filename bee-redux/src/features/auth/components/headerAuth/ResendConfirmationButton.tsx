import * as Dialog from "@/components/radix-ui/radix-dialog";
import { ResendConfirmation } from "@/features/auth/components/ResendConfirmation";

export function ResendConfirmationButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">
        Resend Confirmation Email
      </Dialog.Trigger>
      <Dialog.ContentWithPortal
        className="Auth_dialogContent"
        description="Enter your email"
        hideDescription={true}
        title="Resend Confirmation Email"
      >
        <ResendConfirmation />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
