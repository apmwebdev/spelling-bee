import { Switch } from "@/components/radix-ui/radix-switch";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function HintSeparateKnownControl({
  panelId,
  separateKnown,
}: {
  panelId: number;
  separateKnown: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      id: panelId,
      debounceField: "separateKnown",
      typeData: {
        separateKnown: !separateKnown,
      },
    });
  };
  return (
    <div className="HintSeparateKnownControl">
      <span>Separate Known:</span>
      <Switch checked={separateKnown} onCheckedChange={handleChange} />
    </div>
  );
}
