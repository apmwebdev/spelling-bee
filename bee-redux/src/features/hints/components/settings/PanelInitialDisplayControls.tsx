import { HintPanelData } from "@/features/hints";
import { PanelInitDisplayIsExpandedToggle } from "./PanelInitDisplayIsExpandedToggle";

export function PanelInitialDisplayControls({
  panel,
}: {
  panel: HintPanelData;
}) {
  return (
    <div className="PanelInitialDisplayControls" style={{ gridColumn: "1/3" }}>
      <span>Initial Display:</span>
      <PanelInitDisplayIsExpandedToggle panel={panel} />
    </div>
  );
}
