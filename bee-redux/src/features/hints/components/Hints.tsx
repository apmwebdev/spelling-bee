import {
  hintApiSlice,
  HintPanels,
  HintProfiles,
  selectCurrentPanelData,
} from "@/features/hints";
import "@/styles/hints.scss";
import { useAppSelector } from "@/app/hooks";

import { Statuses } from "@/types";

export function Hints() {
  const currentProfile = useAppSelector(selectCurrentPanelData);
  const profiles =
    hintApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

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
