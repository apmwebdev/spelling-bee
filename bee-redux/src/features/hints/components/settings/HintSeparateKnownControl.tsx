import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

export function HintSeparateKnownControl({
  panelId,
  separateKnown,
  disabled,
}: {
  panelId: number;
  separateKnown: boolean;
  disabled: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.separateKnown}
      currentValue={separateKnown}
      disabled={disabled}
    />
  );
}
