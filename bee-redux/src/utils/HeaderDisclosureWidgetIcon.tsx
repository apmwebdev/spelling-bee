import { Icon } from "@iconify/react"

export function HeaderDisclosureWidgetIcon({
  // isCollapsed,
}: {
  // isCollapsed: boolean
}) {
  const determineIcon = () => {
    // if (isCollapsed) {
    //   return "mdi:chevron-right"
    // }
    // return "mdi:chevron-right"
  }

  return (
    <Icon
      icon="mdi:chevron-right"
      className="header-disclosure-widget-icon"
    ></Icon>
  )
}
