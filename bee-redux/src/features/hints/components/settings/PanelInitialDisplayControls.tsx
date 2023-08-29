import { HintPanelData } from "@/features/hints";

export function PanelInitialDisplayControls({
  panel,
}: {
  panel: HintPanelData;
}) {
  return (
    <div className="PanelInitialDisplayControls" style={{ gridColumn: "1/3" }}>
      Initial Display:
    </div>
  );
}
