import { ReactNode } from "react";

interface SettingsHeaderProps {
  children: ReactNode;
}

export function SettingsHeader({ children }: SettingsHeaderProps) {
  return <header className="SettingsCollapsibleHeader">{children}</header>;
}
