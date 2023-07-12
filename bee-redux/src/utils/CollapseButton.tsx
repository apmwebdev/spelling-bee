import { Icon } from "@iconify/react"

export function CollapseButton({ clickHandler }: { clickHandler?: Function }) {
  return (
    <div
      className="button-box"
      onClick={clickHandler ? () => clickHandler() : undefined}
    >
      <Icon icon="mdi:arrow-collapse"></Icon>
    </div>
  )
}
