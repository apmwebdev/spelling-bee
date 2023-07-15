import { duplicatePanel } from "../hintProfilesSlice"
import { Icon } from "@iconify/react"
import { useDispatch } from "react-redux"

interface DuplicateButtonProps {
  panelId: number
}

export function DuplicateButton({ panelId }: DuplicateButtonProps) {
  const dispatch = useDispatch()

  return (
    <button
      className="button"
      onClick={() => dispatch(duplicatePanel({ panelId }))}
    >
      <Icon icon="mdi:content-copy" className="sb-hint-duplicate-button"></Icon>
    </button>
  )
}