import { Switch } from "@/components/radix-ui/radix-switch";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function HintRevealLengthControl({
  panelId,
  revealLength,
}: {
  panelId: number;
  revealLength: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      id: panelId,
      debounceField: "revealLength",
      typeData: {
        revealLength: !revealLength,
      },
    });
  };
  return (
    <div className="HintRevealLengthControl">
      <span>Reveal Length:</span>
      <Switch checked={revealLength} onCheckedChange={handleChange} />
    </div>
  );
}
