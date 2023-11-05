import { useAppSelector } from "@/app/hooks";

import { Statuses } from "@/types";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { HintPanels, selectCurrentPanelData } from "@/features/hintPanels";

export function Hints() {
  const currentProfile = useAppSelector(selectCurrentPanelData);
  const profiles =
    hintProfilesApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const content = () => {
    if (currentProfile.status === Statuses.UpToDate && profiles.isSuccess) {
      return (
        <>
          {/*<HintProfiles />*/}
          <HintPanels />
        </>
      );
    }
  };

  return <div className="Hints PuzzleMain_section">{content()}</div>;
}
