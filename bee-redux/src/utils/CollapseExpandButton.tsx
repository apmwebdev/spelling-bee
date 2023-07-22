import { ExpandButton } from "./ExpandButton";
import { CollapseButton } from "./CollapseButton";

interface CollapseExpandButtonProps {
  isCollapsed: boolean;
  clickHandler?: Function;
}

export function CollapseExpandButton({
  isCollapsed,
  clickHandler,
}: CollapseExpandButtonProps) {
  if (isCollapsed) {
    return <ExpandButton clickHandler={clickHandler} />;
  }
  return <CollapseButton clickHandler={clickHandler} />;
}
