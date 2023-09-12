import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

export function HintShowKnownControl({
  panelId,
  showKnown,
}: {
  panelId: number;
  showKnown: boolean;
}) {
  return (
    <HintPanelSwitchSetting
      panelId={panelId}
      settingKey={HintPanelBooleanKeys.showKnown}
      currentValue={showKnown}
    />
  );
}
