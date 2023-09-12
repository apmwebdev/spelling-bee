import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

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
