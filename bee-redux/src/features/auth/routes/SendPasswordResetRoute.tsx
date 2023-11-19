/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useSendPasswordResetMutation } from "@/features/auth";
import { SendAuthEmail } from "@/features/auth/components/SendAuthEmail";

export function SendPasswordResetRoute() {
  const [sendPasswordReset] = useSendPasswordResetMutation();

  return (
    <div className="Auth_route">
      <h2>Reset Password</h2>
      <p>
        Submit your email address below. If there is an account for that email
        address, an email will be sent to it with a password recovery link.
      </p>
      <SendAuthEmail sendFn={sendPasswordReset} />
    </div>
  );
}
