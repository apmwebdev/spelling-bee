import { HintPanels } from "@/features/hints";
import { useAppSelector } from "@/app/hooks";

import { Statuses } from "@/types";
import { HintProfiles, hintProfilesApiSlice } from "@/features/hintProfiles";
import { selectCurrentPanelData } from "@/features/hintPanels";

export function Hints() {
  const currentProfile = useAppSelector(selectCurrentPanelData);
  const profiles =
    hintProfilesApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const content = () => {
    if (currentProfile.status === Statuses.UpToDate && profiles.isSuccess) {
      return (
        <>
          <HintProfiles />
          <HintPanels />
        </>
      );
    }
  };

  return <div className="Hints">{content()}</div>;
}
