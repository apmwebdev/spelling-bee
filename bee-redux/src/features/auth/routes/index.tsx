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
