import { Icon } from "@iconify/react"
import { useDispatch } from "react-redux"
import { removePanel } from "../hintProfilesSlice"

interface RemoveButtonProps {
  panelId: number
}

export function RemoveButton({ panelId }: RemoveButtonProps) {
  const dispatch = useDispatch()

  return (
    <button
      className="button"
      onClick={() => dispatch(removePanel({ panelId }))}
    >
      <Icon icon="mdi:close-thick" className="sb-hint-remove-button"></Icon>
    </button>
  )
}
