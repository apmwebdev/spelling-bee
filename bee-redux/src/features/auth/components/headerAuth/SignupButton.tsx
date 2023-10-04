import * as Dialog from "@/components/radix-ui/radix-dialog";
import { Signup } from "@/features/auth";

export function SignupButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">Sign up</Dialog.Trigger>
      <Dialog.ContentWithPortal
        className="Auth_dialogContent"
        description="All fields are required"
        title="Sign Up"
      >
        <Signup />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
