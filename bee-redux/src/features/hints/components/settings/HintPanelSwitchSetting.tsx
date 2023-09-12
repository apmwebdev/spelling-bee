import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import {
  HintPanelBooleanKeys,
  HintPanelBooleanSettings,
} from "@/features/hints";
import { Switch } from "@/components/radix-ui/radix-switch";

export function HintPanelSwitchSetting({
  panelId,
  settingKey,
  currentValue,
  disabled,
}: {
  panelId: number;
  settingKey: HintPanelBooleanKeys;
  currentValue: boolean;
  disabled?: boolean;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    updatePanel({
      id: panelId,
      debounceField: settingKey,
      typeData: {
        [settingKey]: !currentValue,
      },
    });
  };

  return (
    <div className="HintPanelSwitchSetting">
      <span>{HintPanelBooleanSettings[settingKey].title}:</span>
      <Switch
        checked={currentValue}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
