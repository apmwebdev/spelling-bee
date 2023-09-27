import { HintPanelSwitchSetting } from "@/features/hintPanels/components/settings/HintPanelSwitchSetting";

import { HintPanelBooleanKeys } from "@/features/hintPanels";

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
