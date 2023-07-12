import { Icon } from "@iconify/react"

export function ExpandButton({ clickHandler }: { clickHandler?: Function }) {
  return (
    <div
      className="button-box"
      onClick={clickHandler ? () => clickHandler() : undefined}
    >
      <Icon icon="mdi:arrow-expand" className="sb-hint-expand-button"></Icon>
    </div>
  )
}
