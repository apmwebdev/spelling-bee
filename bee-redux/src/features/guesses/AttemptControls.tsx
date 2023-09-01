import { AttemptSelector } from "./attemptControls/AttemptSelector";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { NewAttemptButton } from "@/features/guesses/attemptControls/NewAttemptButton";
import { DeleteAttemptButton } from "@/features/guesses/attemptControls/DeleteAttemptButton";

export function AttemptControls() {
  return (
    <div className="AttemptControls">
      <span>Attempt:</span>
      <AttemptSelector />
      <div className="IconButton-group group-2">
        <NewAttemptButton />
        <DeleteAttemptButton />
      </div>
    </div>
  );
}
