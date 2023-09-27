import { HintPanelSwitchSetting } from "@/features/hintPanels/components/settings/HintPanelSwitchSetting";

import { HintPanelBooleanKeys } from "@/features/hintPanels";

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
