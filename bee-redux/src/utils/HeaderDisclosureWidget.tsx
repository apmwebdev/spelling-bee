import { HeaderDisclosureWidgetIcon } from "./HeaderDisclosureWidgetIcon"
import uniqid from "uniqid"

export function HeaderDisclosureWidget({
  title,
  isCollapsed,
}: {
  title: string
  isCollapsed: boolean
}) {
  return (
    <div className="header-disclosure-widget">
      <HeaderDisclosureWidgetIcon isCollapsed={isCollapsed} />
      <div key={uniqid()}>{title}</div>
    </div>
  )
}
