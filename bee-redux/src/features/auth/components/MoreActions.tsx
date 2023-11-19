/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "@/providers/GlobalContext";
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";

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
    <>
      <DropdownMenu.Item onSelect={handleResetPasswordSelect}>
        <DropdownLinkIcon />
        Reset password
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={handleResendConfirmationSelect}>
        <DropdownLinkIcon />
        Resend confirmation email
      </DropdownMenu.Item>
      <DropdownMenu.Item onSelect={handleResendUnlockSelect}>
        <DropdownLinkIcon />
        Resend account unlock email
      </DropdownMenu.Item>
    </>
  );
}
