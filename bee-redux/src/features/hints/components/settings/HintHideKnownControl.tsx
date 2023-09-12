import { HintPanelSwitchSetting } from "@/features/hints/components/settings/HintPanelSwitchSetting";
import { HintPanelBooleanKeys } from "@/features/hints";

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
