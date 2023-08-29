import { HintPanelData } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function PanelInitDisplayIsExpandedToggle({
  panel,
}: {
  panel: HintPanelData;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {};

  return (
    <div>
      PanelInitDisplayIsExpandedToggle
    </div>
  );
}
