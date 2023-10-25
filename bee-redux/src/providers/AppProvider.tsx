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
