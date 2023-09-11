import { Switch } from "@/components/radix-ui/radix-switch";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function HintShowKnownControl({
  panelId,
  showKnown,
}: {
  panelId: number;
  showKnown: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      id: panelId,
      debounceField: "showKnown",
      typeData: {
        showKnown: !showKnown,
      },
    });
  };
  return (
    <div className="HintShowKnownControl">
      <span>Show Known:</span>
      <Switch checked={showKnown} onCheckedChange={handleChange} />
    </div>
  );
}
