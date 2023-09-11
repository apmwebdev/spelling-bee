import { Switch } from "@/components/radix-ui/radix-switch";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function HintClickToDefineControl({
  panelId,
  clickToDefine,
}: {
  panelId: number;
  clickToDefine: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      id: panelId,
      debounceField: "clickToDefine",
      typeData: {
        clickToDefine: !clickToDefine,
      },
    });
  };
  return (
    <div className="HintClickToDefineControl">
      <span>Click to Define:</span>
      <Switch checked={clickToDefine} onCheckedChange={handleChange} />
    </div>
  );
}
