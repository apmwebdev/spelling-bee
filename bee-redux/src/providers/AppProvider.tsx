import { GlobalContextProvider } from "@/providers/GlobalContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <GlobalContextProvider>
      <TooltipProvider delayDuration={900}>{children}</TooltipProvider>
    </GlobalContextProvider>
  );
}
