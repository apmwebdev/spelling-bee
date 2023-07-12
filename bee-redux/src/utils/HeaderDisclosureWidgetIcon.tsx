import { Icon } from "@iconify/react"

export function HeaderDisclosureWidgetIcon({
  isCollapsed,
}: {
  isCollapsed: boolean
}) {
  const determineIcon = () => {
    if (isCollapsed) {
      return "mdi:chevron-right"
    }
    return "mdi:chevron-down"
  }

  return (
    <Icon
      icon={determineIcon()}
      className="header-disclosure-widget-icon"
    ></Icon>
  )
}
