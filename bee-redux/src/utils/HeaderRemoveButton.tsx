import { Icon } from "@iconify/react";

export function HeaderRemoveButton({
  cssClasses,
  clickHandler,
}: {
  cssClasses?: string;
  clickHandler?: Function;
}) {
  return (
    <button
      className={`button header-remove-button ${cssClasses}`}
      onClick={() => (clickHandler ? clickHandler() : null)}
    >
      <Icon icon="mdi:close-thick"></Icon>
    </button>
  );
}
