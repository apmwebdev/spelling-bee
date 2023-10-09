import { Route, Routes } from "react-router-dom";
import { SignupRoute } from "@/features/auth/routes/SignupRoute";
import { LoginRoute } from "@/features/auth/routes/LoginRoute";
import { ResendConfirmationRoute } from "@/features/auth/routes/ResendConfirmationRoute";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="signup" element={<SignupRoute />} />
      <Route path="login" element={<LoginRoute />} />
      <Route path="resend_confirmation" element={<ResendConfirmationRoute />} />
    </Routes>
  );
}
