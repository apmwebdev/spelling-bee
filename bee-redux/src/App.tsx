import { Header } from "./features/header/Header";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { Signup } from "./features/auth/Signup";
import { Login } from "./features/auth/Login";
import { SubheaderProvider } from "./app/SubheaderProvider";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useGetPrefsQuery } from "./features/userData/userDataApiSlice";

export default function App() {
  const prefsQuery = useGetPrefsQuery(null);

  const appClasses = () => {
    const darkMode = "App dark-theme";
    const lightMode = "App light-theme";
    if (prefsQuery.isError || prefsQuery.isLoading) {
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
      <SubheaderProvider>
        <div className={appClasses()}>
          <div className="sb-top-container">
            <Header />
            <Outlet />
          </div>
        </div>
      </SubheaderProvider>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: rootElement(),
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
