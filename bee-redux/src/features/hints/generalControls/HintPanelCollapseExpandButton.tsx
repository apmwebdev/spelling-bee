import { useDispatch } from "react-redux";
import { setIsCollapsed } from "../hintProfilesSlice";
import { CollapseExpandButton } from "../../../utils/CollapseExpandButton";

interface CollapseButtonProps {
  panelId: number;
  isCollapsed: boolean;
}

export function HintPanelCollapseExpandButton({
  panelId,
  isCollapsed,
}: CollapseButtonProps) {
  const dispatch = useDispatch();

  return (
    <CollapseExpandButton
      isCollapsed={isCollapsed}
      clickHandler={() =>
        dispatch(setIsCollapsed({ panelId, isCollapsed: !isCollapsed }))
      }
    />
  );
}
