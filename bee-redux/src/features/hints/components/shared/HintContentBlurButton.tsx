import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function HintContentBlurButton({
  panelId,
  isBlurred,
}: {
  panelId: number;
  isBlurred: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleClick = () => {
    updatePanel({
      id: panelId,
      debounceField: "currentDisplayIsBlurred",
      currentDisplayState: {
        isBlurred: !isBlurred,
      },
    });
  };

  return (
    <IconButton
      type={isBlurred ? IconButtonTypeKeys.Show : IconButtonTypeKeys.Hide}
      tooltip={isBlurred ? "Show hint content" : "Hide hint content"}
      onClick={handleClick}
      className="HintContentBlurButton"
    />
  );
}
