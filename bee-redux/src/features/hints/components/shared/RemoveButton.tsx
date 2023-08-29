import { useDispatch } from "react-redux";
import { removePanel } from "../../hintProfilesSlice";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

interface RemoveButtonProps {
  panelId: number;
}

export function RemoveButton({ panelId }: RemoveButtonProps) {
  const dispatch = useDispatch();

  return (
    <IconButton
      type={IconButtonTypeKeys.Close}
      className="HintPanelHeaderButton button"
      onClick={() => dispatch(removePanel({ panelId }))}
      tooltip="Delete panel"
    />
  );
}
