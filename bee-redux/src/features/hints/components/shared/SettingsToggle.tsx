import * as Toggle from "@/components/radix-ui/radix-toggle";
import { Icon } from "@iconify/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  PanelCurrentDisplayStateProperties,
  selectPanelDisplayState,
  setPanelDisplayPropThunk,
} from "@/features/hints";

export function SettingsToggle({ panelId }: { panelId: number }) {
  const dispatch = useAppDispatch();
  const display = useAppSelector(selectPanelDisplayState(panelId));
  const toggleExpanded = () => {
    dispatch(
      setPanelDisplayPropThunk({
        panelId: panelId,
        property: PanelCurrentDisplayStateProperties.isSettingsExpanded,
        value: !display.isSettingsExpanded,
      }),
    );
  };
  return (
    <Toggle.Root
      className="PanelSettingsToggle HintPanelHeaderButton IconButton"
      pressed={display.isSettingsExpanded}
      onPressedChange={toggleExpanded}
      disabled={!display.isExpanded}
    >
      <Icon icon="mdi:cog" />
    </Toggle.Root>
  );
}
