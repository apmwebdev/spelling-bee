import { AttemptSelector } from "./attemptControls/AttemptSelector";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function AttemptControls() {
  return (
    <div className="sb-attempt-controls">
      <span>Attempt:</span>
      <AttemptSelector />
      <div className="IconButton-group group-2">
        <IconButton
          type={IconButtonTypeKeys.Create}
          tooltip="Create new attempt"
          className="muted"
        />
        <IconButton
          type={IconButtonTypeKeys.Delete}
          tooltip="Delete selected attempt"
          className="muted"
        />
      </div>
    </div>
  );
}
