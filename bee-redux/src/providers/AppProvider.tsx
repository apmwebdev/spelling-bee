/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { GlobalContextProvider } from "@/providers/GlobalContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Link } from "@/components/react-router/Link";

const errorFallback = ({ error }: FallbackProps) => (
  <div>
    <h1 className="Error_title">Something went wrong</h1>
    <p className="Error_message mono">{JSON.stringify(error)}</p>
    <Link to="/">Go to home page</Link>
  </div>
);

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={errorFallback}>
      <GlobalContextProvider>
        <TooltipProvider delayDuration={900}>
          {children}
        </TooltipProvider>
      </GlobalContextProvider>
    </ErrorBoundary>
  );
}
