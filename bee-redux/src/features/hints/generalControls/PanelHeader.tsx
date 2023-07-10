import { RemoveButton } from './RemoveButton';
import uniqid from 'uniqid';
import { CollapseExpandButton } from "./CollapseExpandButton"
import { HintPanelFormat } from "../hintProfilesSlice"
import { DuplicateButton } from "./DuplicateButton"

interface PanelHeaderProps {
  panel: HintPanelFormat
}

export function PanelHeader({ panel }: PanelHeaderProps) {
  return (
    <div className="sb-hint-panel-header">
      <div className="sb-hint-panel-name">{panel.name}</div>
      <div className="sb-hint-panel-header-buttons">
        <RemoveButton key={uniqid()} panelId={panel.id} />
        <CollapseExpandButton
          key={uniqid()}
          panelId={panel.id}
          isCollapsed={panel.isCollapsed}
        />
        <DuplicateButton key={uniqid()} panelId={panel.id} />
      </div>
    </div>
  )
}