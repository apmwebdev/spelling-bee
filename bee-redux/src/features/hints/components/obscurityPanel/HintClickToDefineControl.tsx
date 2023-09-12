import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

export function HintClickToDefineControl({
  panelId,
  clickToDefine,
}: {
  panelId: number;
  clickToDefine: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.clickToDefine}
      currentValue={clickToDefine}
    />
  );
}
