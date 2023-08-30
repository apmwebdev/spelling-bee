import { Switch } from "@/components/radix-ui/react-switch";
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
      panelSubtype: {
        showKnown: !showKnown,
      },
    });
  };
  return (
    <div className="HintShowKnownControl">
      <span>Show Known:</span>
      <Switch
        checked={showKnown}
        onCheckedChange={handleChange}
      />
    </div>
  );
}
