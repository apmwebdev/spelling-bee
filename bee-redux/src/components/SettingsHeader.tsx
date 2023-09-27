import { ReactNode } from "react";

export function SettingsHeader({ children }: { children: ReactNode }) {
  return <header className="SettingsCollapsibleHeader">{children}</header>;
}
