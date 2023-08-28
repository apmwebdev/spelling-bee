import { Icon } from "@iconify/react";

export function HeaderDisclosureWidget({ title }: { title: string }) {
  // Note: icon is rotated in CSS to indicate collapsed state.
  return (
    <div className="HeaderDisclosureWidget">
      <Icon
        icon="mdi:chevron-right"
        className="HeaderDisclosureWidgetIcon"
      ></Icon>
      <div>{title}</div>
    </div>
  );
}
