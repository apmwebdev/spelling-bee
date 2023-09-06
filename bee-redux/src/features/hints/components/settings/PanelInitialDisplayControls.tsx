import { PanelDisplayState, PanelDisplayStateKeys } from "@/features/hints";
import { PanelInitDisplayCheckboxControl } from "@/features/hints/components/settings/PanelInitDisplayCheckboxControl";
import {
  InitIsBlurredHelpText,
  InitIsExpandedHelpText,
  InitIsSettingsExpandedHelpText,
  InitIsSettingsStickyHelpText,
  InitIsStickyHelpText,
} from "@/features/hints/components/settings/helpText";
import { useAppSelector } from "@/app/hooks";
import { selectPanelDisplayState } from "@/features/hints/hintProfilesSlice";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function PanelInitialDisplayControls({
  panelId,
  initialDisplayState,
}: {
  panelId: number;
  initialDisplayState: PanelDisplayState;
}) {
  const display = useAppSelector(selectPanelDisplayState(panelId));
  const [updatePanel] = useUpdateHintPanelMutation();
  return (
    <div
      className="PanelInitialDisplayControlsContainer"
      style={{ gridColumn: "1/3" }}
    >
      <span>Initial Panel Display</span>
      <div className="PanelInitialDisplayControls">
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSticky}
          currentValue={initialDisplayState.isSticky}
          label="Sticky"
          helpBubbleContent={InitIsStickyHelpText()}
          customHandler={() => {
            const newValue = !initialDisplayState.isSticky;
            const shouldUpdateIsExpanded =
              newValue && !initialDisplayState.isExpanded;
            const shouldUpdateIsBlurred =
              newValue && display.isBlurred !== initialDisplayState.isBlurred;
            updatePanel({
              id: panelId,
              debounceField: "initDisplayIsSticky",
              initialDisplayState: {
                isSticky: newValue,
                isExpanded: shouldUpdateIsExpanded ? true : undefined,
                isBlurred: shouldUpdateIsBlurred
                  ? display.isBlurred
                  : undefined,
              },
            });
          }}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isExpanded}
          currentValue={initialDisplayState.isExpanded}
          disabled={initialDisplayState.isSticky}
          label="Expanded"
          helpBubbleContent={InitIsExpandedHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isBlurred}
          currentValue={initialDisplayState.isBlurred}
          disabled={initialDisplayState.isSticky}
          label="Blurred"
          helpBubbleContent={InitIsBlurredHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSettingsSticky}
          currentValue={initialDisplayState.isSettingsSticky}
          label="Settings Sticky"
          helpBubbleContent={InitIsSettingsStickyHelpText()}
          customHandler={() => {
            const newValue = !initialDisplayState.isSettingsSticky;
            const shouldUpdateIsSettingsExpanded =
              newValue && !initialDisplayState.isSettingsExpanded;
            updatePanel({
              id: panelId,
              debounceField: "initDisplayIsSettingsSticky",
              initialDisplayState: {
                isSettingsSticky: newValue,
                isSettingsExpanded: shouldUpdateIsSettingsExpanded
                  ? true
                  : undefined,
              },
            });
          }}
        />
        <PanelInitDisplayCheckboxControl
          panelId={panelId}
          settingKey={PanelDisplayStateKeys.isSettingsExpanded}
          currentValue={initialDisplayState.isSettingsExpanded}
          disabled={initialDisplayState.isSettingsSticky}
          label="Settings Expanded"
          helpBubbleContent={InitIsSettingsExpandedHelpText()}
        />
      </div>
    </div>
  );
}
