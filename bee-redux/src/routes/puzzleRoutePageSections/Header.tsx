import { useColumnBreakpoints } from "@/hooks/useColumnBreakpoints";
import { DesktopHeader } from "@/features/header/DesktopHeader";
import { MobileHeader } from "@/features/header/MobileHeader";

export function Header() {
  const columns = useColumnBreakpoints();
  if (columns > 1) {
    return <DesktopHeader />;
  }
  return <MobileHeader />;
}
