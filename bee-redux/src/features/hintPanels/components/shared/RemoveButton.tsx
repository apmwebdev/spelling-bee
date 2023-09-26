import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function RemoveButton({ panelId }: { panelId: number }) {
  return (
    <IconButton
      type={IconButtonTypeKeys.Close}
      className="HintPanelHeaderButton"
      tooltip="Delete panel"
    />
  );
}
