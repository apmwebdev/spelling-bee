/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useRouteError } from "react-router-dom";
import { isRoutingError } from "@/routes/types";
import { Header } from "@/routes/puzzleRoutePageSections/Header";

export function RoutingError() {
  const error = useRouteError();
  console.error(error);

  const content = (error: any) => {
    if (!isRoutingError(error)) {
      return <p className="Error_message mono">{JSON.stringify(error)}</p>;
    }
    return (
      <>
        <h2 className="Error_subtitle">
          {error.status}: {error.statusText}
        </h2>
        <p className="Error_message">{error.data}</p>
      </>
    );
  };

  return (
    <div className="RoutingError">
      <Header />
      <main>
        <h1 className="Error_title">Routing Error</h1>
        {content(error)}
      </main>
    </div>
  );
}
