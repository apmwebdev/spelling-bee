import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { useGetUserBaseDataQuery } from "@/features/userData";
import { RoutingError } from "@/routes/RoutingError";
import { Header } from "@/routes/puzzleRoutePageSections/Header";
import { AppProvider } from "@/providers/AppProvider";
import { useAppClasses } from "@/hooks/useAppClasses";
import { NonPuzzleLayout } from "@/routes/NonPuzzleLayout";
import { SignupRoute } from "@/features/auth/routes/SignupRoute";
import { LoginRoute } from "@/features/auth/routes/LoginRoute";
import { AccountRoute } from "@/features/auth/routes/AccountRoute";
import { ResendConfirmationRoute } from "@/features/auth/routes/ResendConfirmationRoute";
import { ResendUnlockRoute } from "@/features/auth/routes/ResendUnlockRoute";

export default function App() {
  useGetUserBaseDataQuery();
  const appClasses = useAppClasses();

  const rootElement = () => {
    return (
      <AppProvider>
        <div className={appClasses}>
          <div className="SSB_TopContainer">
            <Header />
            <Outlet />
          </div>
        </div>
      </AppProvider>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={rootElement()} errorElement={<RoutingError />}>
          <Route index element={<PuzzleRoute />} />
          <Route path="puzzle/:identifier" element={<PuzzleRoute />} />
          <Route path="puzzles/:identifier" element={<PuzzleRoute />} />
          <Route path="auth/*" element={<NonPuzzleLayout />}>
            <Route path="signup" element={<SignupRoute />} />
            <Route path="login" element={<LoginRoute />} />
            <Route path="account" element={<AccountRoute />} />
            <Route
              path="resend_confirmation"
              element={<ResendConfirmationRoute />}
            />
            <Route path="resend_unlock" element={<ResendUnlockRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
