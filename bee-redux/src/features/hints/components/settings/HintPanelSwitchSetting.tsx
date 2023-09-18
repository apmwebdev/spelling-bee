import {
  HintPanelBooleanKeys,
  HintPanelBooleanSettings,
  useUpdateHintPanelMutation,
} from "@/features/hints";
import { Switch } from "@/components/radix-ui/radix-switch";
import { maybeAddDisabledClass } from "@/util";

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
    <div>
      <span
        className={maybeAddDisabledClass("HintPanelSwitchSetting", disabled)}
      >
        {HintPanelBooleanSettings[settingKey].title}:
      </span>
      <Switch
        checked={currentValue}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
