import { HintPanelSwitchSetting } from "@/features/hintPanels/components/settings/HintPanelSwitchSetting";

import { HintPanelBooleanKeys } from "@/features/hintPanels/types";

export function HintRevealLengthControl({
  panelId,
  revealLength,
}: {
  panelId: number;
  revealLength: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.revealLength}
      currentValue={revealLength}
    />
  );
}
