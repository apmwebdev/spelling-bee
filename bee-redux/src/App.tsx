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
      console.log("loading or error");
      if (matchMedia("(prefers-color-scheme: light)").matches) return lightMode;
      console.log("not light mode");
      return darkMode;
    }
    if (prefsQuery.isSuccess) {
      console.log("success");
      const colorPref = prefsQuery.data.colorScheme;
      console.log("colorPref:", colorPref);
      if (colorPref === "light") return lightMode;
      console.log("not light mode");
      if (colorPref === "dark") return darkMode;
      console.log("not dark mode");
      console.log(matchMedia("(prefers-color-scheme: light)"));
      if (matchMedia("(prefers-color-scheme: light)").matches) return lightMode;
      console.log("not auto light mode");
    }
    return darkMode;
  };

  const rootElement = () => {
    return (
      <SubheaderProvider>
        <ScrollArea.Root type="auto">
          <ScrollArea.Viewport className={appClasses()}>
            <div className="sb-top-container">
              <Header />
              <Outlet />
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="scrollbar">
            <ScrollArea.Thumb className="scrollbar-thumb" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
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
