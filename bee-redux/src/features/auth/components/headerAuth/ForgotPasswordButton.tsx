/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
