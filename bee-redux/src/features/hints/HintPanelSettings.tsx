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
  const settingsContentId = `hint-settings-content-${panel.id}`

  return (
    <div className="sb-hint-panel-settings">
      <SettingsHeader
        panelId={panel.id}
        settingsAreCollapsed={panel.settingsAreCollapsed}
        contentId={settingsContentId}
      />
      <div className={cssClasses()} id={settingsContentId}>
        <TypeSettingsComponent />
        <GeneralPanelSettings panel={panel} />
      </div>
    </div>
  )
}