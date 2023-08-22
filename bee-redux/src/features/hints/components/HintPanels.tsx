import { useAppSelector } from "@/app/hooks";
import { selectHintProfiles } from "../hintProfilesSlice";
import { HintPanel } from "./HintPanel";

export function HintPanels() {
  const { currentProfile } = useAppSelector(selectHintProfiles);
  return (
    <div className="HintPanels">
      {/*{currentProfile.panels.map((panel, i) => {*/}
      {/*  return <HintPanel key={`hintPanel ${i}`} panel={panel} />;*/}
      {/*})}*/}
    </div>
  );
}
