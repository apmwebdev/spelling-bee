import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { useAppDispatch } from "@/app/hooks";
import { shuffleOuterLetters } from "@/features/puzzle";

export function ShuffleButton() {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(shuffleOuterLetters());
  };

  return (
    <IconButton
      type={IconButtonTypeKeys.Shuffle}
      onClick={handleClick}
      tooltip="Shuffle letters"
    />
  );
}
