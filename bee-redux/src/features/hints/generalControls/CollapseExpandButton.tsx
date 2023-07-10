import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { setIsCollapsed } from "../hintProfilesSlice"

interface CollapseButtonProps {
  panelId: number
  isCollapsed: boolean
}

export function CollapseExpandButton({
  panelId,
  isCollapsed,
}: CollapseButtonProps) {
  const dispatch = useDispatch()

  const content = () => {
    if (isCollapsed) {
      return (
        <div
          className="sb-hint-expand-button-box hint-button-box"
          onClick={() =>
            dispatch(setIsCollapsed({ panelId, isCollapsed: false }))
          }
        >
          <Icon
            icon="mdi:arrow-expand"
            className="sb-hint-expand-button"
          ></Icon>
        </div>
      )
    }
    return (
      <div
        className="sb-hint-collapse-button-box hint-button-box"
        onClick={() =>
          dispatch(setIsCollapsed({ panelId, isCollapsed: !isCollapsed }))
        }
      >
        <Icon
          icon="mdi:arrow-collapse"
          className="sb-hint-collapse-button"
        ></Icon>
      </div>
    )
  }
  return content()
}
