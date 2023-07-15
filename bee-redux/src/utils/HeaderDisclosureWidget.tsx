import { HeaderDisclosureWidgetIcon } from "./HeaderDisclosureWidgetIcon"
import uniqid from "uniqid"

export function HeaderDisclosureWidgetButton({
  title,
  isCollapsed,
}: {
  title: string
  isCollapsed: boolean
}) {
  return (
    <div className="header-disclosure-widget">
      <HeaderDisclosureWidgetIcon isCollapsed={isCollapsed} />
      <div>{title}</div>
    </div>
  )
}
