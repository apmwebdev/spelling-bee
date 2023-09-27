import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { Signup } from "./features/auth/Signup";
import { Login } from "./features/auth/Login";
import { useGetUserBaseDataQuery, userDataApiSlice } from "@/features/userData";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { RoutingError } from "@/routes/RoutingError";
import { Header } from "@/routes/puzzleRoutePageSections/Header";

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
          path: "puzzles/:identifier",
          element: <PuzzleRoute />,
        },
        {
          path: "puzzle/:identifier",
          element: <PuzzleRoute />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
