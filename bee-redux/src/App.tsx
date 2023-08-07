import { Header } from "./features/header/Header";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { PuzzleRoute } from "./routes/PuzzleRoute";
import { Signup } from "./features/auth/Signup";
import { Login } from "./features/auth/Login";
import { SubheaderProvider } from "./app/SubheaderProvider";

export default function App() {
  const rootElement = (
    <SubheaderProvider>
      <div className="App">
        <div className="sb-top-container">
          <Header />
          <Outlet />
        </div>
      </div>
    </SubheaderProvider>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: rootElement,
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
