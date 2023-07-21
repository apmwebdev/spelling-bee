import { Header } from "./features/header/Header"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { PuzzleRoute } from "./routes/PuzzleRoute"

export default function App() {
  const rootElement = (
    <div className="App">
      <div className="sb-top-container">
        <Header />
        <Outlet />
      </div>
    </div>
  )

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
      ],
    },
  ])

  return <RouterProvider router={router} />
}
