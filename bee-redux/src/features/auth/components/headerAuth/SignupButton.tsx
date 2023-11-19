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
