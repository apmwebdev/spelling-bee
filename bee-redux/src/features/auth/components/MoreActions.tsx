import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/providers/GlobalContext";

//TODO: Figure out how to make this look better
export function MoreActions() {
  const navigate = useNavigate();
  const { closePopupsEvent } = useContext(GlobalContext);

  const handleResetPasswordSelect = () => {
    window.dispatchEvent(closePopupsEvent);
    navigate("/auth/send_password_reset");
  };

  const handleResendConfirmationSelect = () => {
    window.dispatchEvent(closePopupsEvent);
    navigate("/auth/resend_confirmation");
  };

  const handleResendUnlockSelect = () => {
    window.dispatchEvent(closePopupsEvent);
    navigate("/auth/resend_unlock");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal>
        <DropdownMenu.Item onSelect={handleResetPasswordSelect}>
          Reset password
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleResendConfirmationSelect}>
          Resend confirmation email
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleResendUnlockSelect}>
          Resend account unlock email
        </DropdownMenu.Item>
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
