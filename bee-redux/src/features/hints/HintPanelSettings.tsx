import { HintPanelFormat } from "./hintProfilesSlice"
import { GeneralPanelSettings } from "./GeneralPanelSettings"
import { ComponentType } from "react"
import { SettingsHeader } from "./generalControls/SettingsHeader"

interface HintPanelSettingsProps {
  panel: HintPanelFormat
  TypeSettingsComponent: ComponentType
}

export function HintPanelSettings({
  panel,
  TypeSettingsComponent,
}: HintPanelSettingsProps) {
  const cssClasses = () => {
    let returnString = "sb-hint-panel-settings-content"
    if (panel.settingsAreCollapsed) {
      returnString += " display-none"
    }
    return returnString
  }

  return (
    <div className="sb-hint-panel-settings">
      <SettingsHeader
        panelId={panel.id}
        settingsAreCollapsed={panel.settingsAreCollapsed}
      />
      <div className={cssClasses()}>
        <TypeSettingsComponent />
        <GeneralPanelSettings panel={panel} />
      </div>
    </div>
  )
}