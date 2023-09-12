import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

export function HintShowObscurityControl({
  panelId,
  showObscurity,
}: {
  panelId: number;
  showObscurity: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.showObscurity}
      currentValue={showObscurity}
    />
  );
}
