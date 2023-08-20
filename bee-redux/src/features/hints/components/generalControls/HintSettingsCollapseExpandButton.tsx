import { useDispatch } from "react-redux";
import { setSettingsAreCollapsed } from "../../hintProfilesSlice";
import { CollapseExpandButton } from "@/utils/CollapseExpandButton";

interface HintSettingsCollapseExpandButtonProps {
  panelId: number;
  settingsAreCollapsed: boolean;
}

export function HintSettingsCollapseExpandButton({
  panelId,
  settingsAreCollapsed,
}: HintSettingsCollapseExpandButtonProps) {
  const dispatch = useDispatch();

  return (
    <CollapseExpandButton
      isCollapsed={settingsAreCollapsed}
      clickHandler={() =>
        dispatch(
          setSettingsAreCollapsed({
            panelId,
            settingsAreCollapsed: !settingsAreCollapsed,
          }),
        )
      }
    />
  );
}
