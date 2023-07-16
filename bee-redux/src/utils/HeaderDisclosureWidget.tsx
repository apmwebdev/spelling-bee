import { Icon } from "@iconify/react"

export function HeaderDisclosureWidget({ title }: { title: string }) {
  // Note: icon is rotated in CSS to indicate collapsed state.
  return (
    <div className="header-disclosure-widget">
      <Icon
        icon="mdi:chevron-right"
        className="header-disclosure-widget-icon"
      ></Icon>
      <div>{title}</div>
    </div>
  )
}
