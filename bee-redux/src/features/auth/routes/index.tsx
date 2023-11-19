/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Outlet, Route } from "react-router-dom";
import { SignupRoute } from "@/features/auth/routes/SignupRoute";
import { LoginRoute } from "@/features/auth/routes/LoginRoute";
import { ResendConfirmationRoute } from "@/features/auth/routes/ResendConfirmationRoute";
import { AccountRoute } from "@/features/auth/routes/AccountRoute";

//TODO: Either do centralized or decentralized auth routes, not both
export function AuthRoutes() {
  return (
    <Route path="auth/*" element={<Outlet />}>
      <Route path="signup" element={<SignupRoute />} />
      <Route path="login" element={<LoginRoute />} />
      <Route path="resend_confirmation" element={<ResendConfirmationRoute />} />
      <Route path="account" element={<AccountRoute />} />
    </Route>
  );
}
