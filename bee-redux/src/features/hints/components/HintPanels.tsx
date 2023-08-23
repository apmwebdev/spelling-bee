import { HintPanel } from "./HintPanel";
import { hintApiSlice } from "@/features/hints/hintApiSlice";

export function HintPanels() {
  const currentProfile =
    hintApiSlice.endpoints.getCurrentHintProfile.useQueryState(undefined);
  return (
    <div className="HintPanels">
      {currentProfile.data?.panels.map((panel, i) => {
        return <HintPanel key={`hintPanel ${i}`} panel={panel} />;
      })}
    </div>
  );
}
