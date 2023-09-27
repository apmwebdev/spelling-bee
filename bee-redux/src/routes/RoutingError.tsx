import { useRouteError } from "react-router-dom";
import { TRoutingError } from "@/routes/types";
import { Header } from "@/routes/puzzleRoutePageSections/Header";

export function RoutingError() {
  const error = useRouteError() as TRoutingError;
  console.error(error);
  return (
    <div className="RoutingError">
      <Header />
      <main>
        <h1 className="RoutingError_title">Routing Error</h1>
        <h2 className="RoutingError_subtitle">
          {error.status}: {error.statusText}
        </h2>
        <p className="RoutingError_message">{error.data}</p>
      </main>
    </div>
  );
}
