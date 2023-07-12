import uniqid from "uniqid"
import { HintSettingsCollapseExpandButton } from "./HintSettingsCollapseExpandButton"
import { CollapseExpandButton } from '../../../utils/CollapseExpandButton';
import { useDispatch } from 'react-redux';
import { setIsCollapsed, setSettingsAreCollapsed } from '../hintProfilesSlice';
import { Icon, InlineIcon } from '@iconify/react';
import { HeaderDisclosureWidget } from '../../../utils/HeaderDisclosureWidget';

interface PanelHeaderProps {
  panelId: number
  settingsAreCollapsed: boolean
}

export function SettingsHeader({
  panelId,
  settingsAreCollapsed,
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
    <div className={cssClasses()} onClick={toggleCollapsed}>
      <HeaderDisclosureWidget
        key={uniqid()}
        title="Settings"
        isCollapsed={settingsAreCollapsed}
      />
    </div>
  )
}
