import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function DuplicateButton({ panelId }: { panelId: number }) {
  return (
    <IconButton
      type={IconButtonTypeKeys.Duplicate}
      className="HintPanelHeaderButton"
      // onClick={() => dispatch(duplicatePanel({ panelId }))}
      tooltip="Duplicate panel"
    />
  );
}
