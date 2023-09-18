import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useAddAttemptMutation } from "@/features/guesses";

export function NewAttemptButton() {
  const [addAttempt] = useAddAttemptMutation();
  const handleClick = () => {};

  return (
    <IconButton
      type={IconButtonTypeKeys.Create}
      tooltip="Create new attempt"
      onClick={handleClick}
    />
  );
}
