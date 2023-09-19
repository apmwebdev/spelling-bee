import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

interface DuplicateButtonProps {
  panelId: number;
}

export function DuplicateButton({ panelId }: DuplicateButtonProps) {
  return (
    <IconButton
      type={IconButtonTypeKeys.Duplicate}
      className="HintPanelHeaderButton"
      // onClick={() => dispatch(duplicatePanel({ panelId }))}
      tooltip="Duplicate panel"
    />
  );
}
