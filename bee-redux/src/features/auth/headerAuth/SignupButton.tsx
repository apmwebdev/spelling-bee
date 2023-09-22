import * as Dialog from "@/components/radix-ui/radix-dialog";
import { Signup } from "@/features/auth/Signup";

export function SignupButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">Sign up</Dialog.Trigger>
      <Dialog.ContentWithPortal
        description="Sign up for an account"
        hideDescription={true}
        title="Sign Up"
      >
        <Signup />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
