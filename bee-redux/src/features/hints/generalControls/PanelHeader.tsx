import { RemoveButton } from "./RemoveButton"
import uniqid from "uniqid"
import { setIsCollapsed } from "../hintProfilesSlice"
import { DuplicateButton } from "./DuplicateButton"
import { useDispatch } from "react-redux"
import { HeaderDisclosureWidget } from "../../../utils/HeaderDisclosureWidget"

interface PanelHeaderProps {
  panelId: number
  panelName: string
  isCollapsed: boolean
  contentID: string
}

export function PanelHeader({
  panelId,
  panelName,
  isCollapsed,
  contentID,
}: PanelHeaderProps) {
  const dispatch = useDispatch()

  const cssClasses = () => {
    let classList = "sb-hint-panel-header click-header-to-collapse"
    if (isCollapsed) {
      classList += " collapsed"
    } else {
      classList += " expanded"
    }
    return classList
  }

  const toggleCollapsed = () => {
    dispatch(setIsCollapsed({ panelId, isCollapsed: !isCollapsed }))
  }
  return (
    <header className={cssClasses()}>
      <div className="sb-hint-panel-header-buttons-left">
        <RemoveButton key={uniqid()} panelId={panelId} />
      </div>
      <button
        className="sb-hint-panel-header-collapse-button"
        aria-controls={contentID}
        aria-expanded={!isCollapsed}
        onClick={toggleCollapsed}
      >
        <HeaderDisclosureWidget title={panelName} isCollapsed={isCollapsed} />
      </button>
      <div className="sb-hint-panel-header-buttons-right">
        <DuplicateButton key={uniqid()} panelId={panelId} />
      </div>
    </header>
  )
}