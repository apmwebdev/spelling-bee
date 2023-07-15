import { useDispatch } from "react-redux"
import { setSettingsAreCollapsed } from "../hintProfilesSlice"
import { HeaderDisclosureWidget } from "../../../utils/HeaderDisclosureWidget"

interface PanelHeaderProps {
  panelId: number
  settingsAreCollapsed: boolean
  contentId: string
}

export function SettingsHeader({
  panelId,
  settingsAreCollapsed,
  contentId,
}: PanelHeaderProps) {
  const dispatch = useDispatch()

  const cssClasses = () => {
    let classList = "sb-hint-panel-settings-header click-header-to-collapse"
    if (settingsAreCollapsed) {
      classList += " collapsed"
    } else {
      classList += " expanded"
    }
    return classList
  }

  const toggleCollapsed = () => {
    dispatch(
      setSettingsAreCollapsed({
        panelId,
        settingsAreCollapsed: !settingsAreCollapsed,
      }),
    )
  }

  return (
    <header className={cssClasses()}>
      <button
        className="sb-hint-panel-settings-header-button"
        onClick={toggleCollapsed}
        aria-controls={contentId}
        aria-expanded={!settingsAreCollapsed}
      >
        <HeaderDisclosureWidget
          title="Settings"
          isCollapsed={settingsAreCollapsed}
        />
      </button>
    </header>
  )
}
