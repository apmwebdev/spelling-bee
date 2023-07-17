import { Icon } from "@iconify/react"

export function HeaderRemoveButton({
  cssClasses,
  clickHandler,
}: {
  cssClasses?: string
  clickHandler: Function
}) {
  return (
    <button
      className={`button header-remove-button ${cssClasses}`}
      onClick={() => clickHandler()}
    >
      <Icon icon="mdi:close-thick"></Icon>
    </button>
  )
}
