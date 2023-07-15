import { ReactNode } from "react"

interface SettingsHeaderProps {
  children: ReactNode
}

export function SettingsHeader({ children }: SettingsHeaderProps) {
  return <header className="sb-hint-panel-settings-header">{children}</header>
}
