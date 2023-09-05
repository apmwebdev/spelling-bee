import { HintProfiles } from "./HintProfiles";
import { HintPanels } from "./HintPanels";
import { hintApiSlice } from "@/features/hints/hintApiSlice";
import "@/styles/hints.scss";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentPanelData } from "@/features/hints/hintProfilesSlice";
import { Status } from "@/features/guesses/guessesSlice";

export function Hints() {
  // const currentProfile =
  //   hintApiSlice.endpoints.getCurrentHintProfile.useQueryState(undefined);
  const currentProfile = useAppSelector(selectCurrentPanelData);
  const profiles =
    hintApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const content = () => {
    if (currentProfile.status === Status.UpToDate && profiles.isSuccess) {
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
