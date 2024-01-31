/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { useGetUserBaseDataQuery } from "@/features/userData";
import { Header } from "@/routes/puzzleRoutePageSections/Header";
import { AppProvider } from "@/providers/AppProvider";
import { useAppClasses } from "@/hooks/useAppClasses";
import { NonPuzzleLayout } from "@/routes/NonPuzzleLayout";
import { SignupRoute } from "@/features/auth/routes/SignupRoute";
import { LoginRoute } from "@/features/auth/routes/LoginRoute";
import { AccountRoute } from "@/features/auth/routes/AccountRoute";
import { ResendConfirmationRoute } from "@/features/auth/routes/ResendConfirmationRoute";
import { ResendUnlockRoute } from "@/features/auth/routes/ResendUnlockRoute";
import { SendPasswordResetRoute } from "@/features/auth/routes/SendPasswordResetRoute";
import { ResetPasswordRoute } from "@/features/auth/routes/ResetPasswordRoute";
import { RoutingError } from "@/routes/RoutingError";

export function App() {
  useGetUserBaseDataQuery();
  const appClasses = useAppClasses();

  const rootElement = () => {
    return (
      <AppProvider>
        <div className={appClasses}>
          <Header />
          <Outlet />
        </div>
      </AppProvider>
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={rootElement()} errorElement={<RoutingError />}>
        <Route index element={<PuzzleRoute />} />
        <Route path="puzzle/:identifier" element={<PuzzleRoute />} />
        <Route path="puzzles/:identifier" element={<PuzzleRoute />} />
        <Route path="auth/*" element={<NonPuzzleLayout />}>
          <Route path="signup" element={<SignupRoute />} />
          <Route path="login" element={<LoginRoute />} />
          <Route path="account" element={<AccountRoute />} />
          <Route
            path="send_password_reset"
            element={<SendPasswordResetRoute />}
          />
          <Route path="reset_password" element={<ResetPasswordRoute />} />
          <Route
            path="resend_confirmation"
            element={<ResendConfirmationRoute />}
          />
          <Route path="resend_unlock" element={<ResendUnlockRoute />} />
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
}
