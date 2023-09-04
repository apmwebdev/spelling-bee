import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

interface RemoveButtonProps {
  panelId: number;
}

export function RemoveButton({ panelId }: RemoveButtonProps) {
  return (
    <IconButton
      type={IconButtonTypeKeys.Close}
      className="HintPanelHeaderButton button"
      tooltip="Delete panel"
    />
  );
}
