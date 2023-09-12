import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function DragHandle() {
  return (
    <IconButton
      type={IconButtonTypeKeys.DragVertical}
      className="DragHandle HintPanelHeaderButton button"
      tooltip="Drag and drop to change panel order"
    />
  );
}
