import { RemoveButton } from './RemoveButton';
import uniqid from 'uniqid';
import { HintPanelCollapseExpandButton } from "./HintPanelCollapseExpandButton"
import { HintPanelFormat, setIsCollapsed } from '../hintProfilesSlice';
import { DuplicateButton } from "./DuplicateButton"
import { useDispatch } from 'react-redux';
import { HeaderDisclosureWidget } from '../../../utils/HeaderDisclosureWidget';

interface PanelHeaderProps {
  panelId: number
  panelName: string
  isCollapsed: boolean
}

export function PanelHeader({
  panelId,
  panelName,
  isCollapsed,
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
    <div className={cssClasses()} onClick={toggleCollapsed}>
      <div className="sb-hint-panel-header-buttons-left">
        <RemoveButton key={uniqid()} panelId={panelId} />
      </div>
      <HeaderDisclosureWidget
        key={uniqid()}
        title={panelName}
        isCollapsed={isCollapsed}
      />
      <div className="sb-hint-panel-header-buttons-right">
        <DuplicateButton key={uniqid()} panelId={panelId} />
      </div>
    </div>
  )
}