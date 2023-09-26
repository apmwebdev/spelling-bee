import { HintPanelSwitchSetting } from "@/features/hintPanels/components/settings/HintPanelSwitchSetting";

import { HintPanelBooleanKeys } from "@/features/hintPanels/types";

export function HintHideKnownControl({
  panelId,
  hideKnown,
}: {
  panelId: number;
  hideKnown: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.hideKnown}
      currentValue={hideKnown}
    />
  );
}
