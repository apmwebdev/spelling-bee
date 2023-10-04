import * as Dialog from "@/components/radix-ui/radix-dialog";
import { Login } from "@/features/auth";

export function LoginButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="standardButton">Log in</Dialog.Trigger>
      <Dialog.ContentWithPortal
        className="Auth_dialogContent"
        description="Log in to your account"
        hideDescription={true}
        title="Log In"
      >
        <Login />
      </Dialog.ContentWithPortal>
    </Dialog.Root>
  );
}
