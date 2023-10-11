import {
  BrowserRouter,
  createBrowserRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { useGetUserBaseDataQuery, userDataApiSlice } from "@/features/userData";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { RoutingError } from "@/routes/RoutingError";
import { Header } from "@/routes/puzzleRoutePageSections/Header";
import { AuthRoutes } from "@/features/auth";
import { SignupRoute } from "@/features/auth/routes/SignupRoute";
import { LoginRoute } from "@/features/auth/routes/LoginRoute";
import { ResendConfirmationRoute } from "@/features/auth/routes/ResendConfirmationRoute";
import { NonPuzzleLayout } from "@/routes/NonPuzzleLayout";
import { AccountRoute } from "@/features/auth/routes/AccountRoute";

export default function App() {
  useGetUserBaseDataQuery();
  const prefsQuery =
    userDataApiSlice.endpoints.getUserPrefs.useQueryState(undefined);

  const appClasses = () => {
    const darkMode = "App dark-theme";
    const lightMode = "App light-theme";
    if (
      prefsQuery.isError ||
      prefsQuery.isLoading ||
      prefsQuery.isUninitialized
    ) {
      if (matchMedia("(prefers-color-scheme: light)").matches) return lightMode;
      return darkMode;
    }
    if (prefsQuery.isSuccess) {
      const colorPref = prefsQuery.data.colorScheme;
      if (colorPref === "light") return lightMode;
      if (colorPref === "dark") return darkMode;
      if (matchMedia("(prefers-color-scheme: light)").matches) return lightMode;
    }
    return darkMode;
  };

  const rootElement = () => {
    return (
      <TooltipProvider delayDuration={900}>
        <div className={appClasses()}>
          <div className="SSB_TopContainer">
            <Header />
            <Outlet />
          </div>
        </div>
      </TooltipProvider>
    );
  };

  //TODO: Get rid of this if not using it
  const router = createBrowserRouter([
    {
      path: "/",
      element: rootElement(),
      errorElement: <RoutingError />,
      children: [
        {
          index: true,
          element: <PuzzleRoute />,
        },
        {
          path: "puzzle/:identifier",
          element: <PuzzleRoute />,
        },
        {
          path: "puzzles/:identifier",
          element: <PuzzleRoute />,
        },
        {
          path: "auth/*",
          element: <AuthRoutes />,
        },
      ],
    },
  ]);

  // return <RouterProvider router={router} />;
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
            <Route
              path="resend_confirmation"
              element={<ResendConfirmationRoute />}
            />
            <Route path="account" element={<AccountRoute />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
