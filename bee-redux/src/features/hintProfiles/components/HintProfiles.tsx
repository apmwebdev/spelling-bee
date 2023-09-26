import { HintProfilesSelector } from "./HintProfilesSelector";
import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";

export function HintProfiles() {
  return (
    <div className="HintProfiles">
      <span>Hint profile:</span>
      <HintProfilesSelector />
      <div className="IconButton-group group-3">
        <IconButton
          type={IconButtonTypeKeys.Create}
          tooltip="Create new hint profile"
        />
        <IconButton
          type={IconButtonTypeKeys.Delete}
          tooltip="Delete selected hint profile"
        />
        <IconButton
          type={IconButtonTypeKeys.Duplicate}
          tooltip="Duplicate selected hint profile"
        />
      </div>
    </div>
  );
}
