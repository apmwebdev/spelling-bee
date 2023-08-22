import { useAppSelector } from "@/app/hooks";
import { selectHintProfiles } from "../hintProfilesSlice";
import { HintPanel } from "./HintPanel";

export function Hints() {
  const { currentProfile } = useAppSelector(selectHintProfiles);
  return (
    <div className="sb-hints">
      {/*{currentProfile.panels.map((panel, i) => {*/}
      {/*  return <HintPanel key={`hintPanel ${i}`} panel={panel} />;*/}
      {/*})}*/}
    </div>
  );
}
