import { HintProfiles } from "./HintProfiles";
import { HintPanels } from "./HintPanels";
import { hintApiSlice } from "@/features/hints/hintApiSlice";
import "@/styles/hints.scss";

export function Hints() {
  const currentProfile =
    hintApiSlice.endpoints.getCurrentHintProfile.useQueryState(undefined);
  const profiles =
    hintApiSlice.endpoints.getHintProfiles.useQueryState(undefined);

  const content = () => {
    if (currentProfile.isSuccess && profiles.isSuccess) {
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
