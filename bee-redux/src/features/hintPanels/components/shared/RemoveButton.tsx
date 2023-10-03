import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function RemoveButton({ panelId }: { panelId: number }) {
  return (
    <IconButton
      type={IconButtonTypeKeys.Delete}
      className="HintPanelHeaderButton"
      tooltip="Delete panel"
    />
  );
}
