import { duplicatePanel } from "../hintProfilesSlice"
import { Icon } from "@iconify/react"
import { useDispatch } from "react-redux"

interface DuplicateButtonProps {
  panelId: number
}

export function DuplicateButton({ panelId }: DuplicateButtonProps) {
  const dispatch = useDispatch()

  return (
    <div
      className="sb-hint-duplicate-button-box hint-button-box"
      onClick={() => dispatch(duplicatePanel({ panelId }))}
    >
      <Icon
        icon="mdi:content-copy"
        className="sb-hint-duplicate-button"
      ></Icon>
    </div>
  )
}