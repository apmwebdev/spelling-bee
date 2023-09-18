import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useDeleteAttemptMutation } from "@/features/guesses";

export function DeleteAttemptButton() {
  const [deleteAttempt] = useDeleteAttemptMutation();
  const handleClick = () => {};

  return (
    <IconButton
      type={IconButtonTypeKeys.Delete}
      tooltip="Delete selected attempt"
      onClick={handleClick}
    />
  );
}
