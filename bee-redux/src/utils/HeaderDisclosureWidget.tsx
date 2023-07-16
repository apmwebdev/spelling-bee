import { HeaderDisclosureWidgetIcon } from "./HeaderDisclosureWidgetIcon"
import uniqid from "uniqid"

export function HeaderDisclosureWidget({
  title,
  // isCollapsed,
}: {
  title: string
  // isCollapsed: boolean
}) {
  return (
    <div className="header-disclosure-widget">
      <HeaderDisclosureWidgetIcon />
      <div>{title}</div>
    </div>
  )
}
