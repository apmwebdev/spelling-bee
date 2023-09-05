import { HintPanelData, PanelDisplayStateKeys } from "@/features/hints";
import { PanelInitDisplayCheckboxControl } from "@/features/hints/components/settings/PanelInitDisplayCheckboxControl";
import {
  InitIsBlurredHelpText,
  InitIsExpandedHelpText,
  InitIsSettingsExpandedHelpText,
  InitIsSettingsStickyHelpText,
  InitIsStickyHelpText,
} from "@/features/hints/components/settings/helpText";
import { useAppSelector } from "@/app/hooks";
import { selectPanelsDisplayState } from "@/features/hints/hintProfilesSlice";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function PanelInitialDisplayControls({
  panel,
}: {
  panel: HintPanelData;
}) {
  const display = useAppSelector(selectPanelsDisplayState)[panel.id];
  const [updatePanel] = useUpdateHintPanelMutation();
  return (
    <div
      className="PanelInitialDisplayControlsContainer"
      style={{ gridColumn: "1/3" }}
    >
      <span>Initial Panel Display</span>
      <div className="PanelInitialDisplayControls">
        <PanelInitDisplayCheckboxControl
          panel={panel}
          settingKey={PanelDisplayStateKeys.isSticky}
          label="Sticky"
          helpBubbleContent={InitIsStickyHelpText()}
          customHandler={() => {
            const newValue = !panel.initialDisplayState.isSticky;
            const shouldUpdateIsExpanded =
              newValue && !panel.initialDisplayState.isExpanded;
            const shouldUpdateIsBlurred =
              newValue &&
              display.isBlurred !== panel.initialDisplayState.isBlurred;
            updatePanel({
              id: panel.id,
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
          panel={panel}
          settingKey={PanelDisplayStateKeys.isExpanded}
          disableKey={PanelDisplayStateKeys.isSticky}
          label="Expanded"
          helpBubbleContent={InitIsExpandedHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panel={panel}
          settingKey={PanelDisplayStateKeys.isBlurred}
          disableKey={PanelDisplayStateKeys.isSticky}
          label="Blurred"
          helpBubbleContent={InitIsBlurredHelpText()}
        />
        <PanelInitDisplayCheckboxControl
          panel={panel}
          settingKey={PanelDisplayStateKeys.isSettingsSticky}
          label="Settings Sticky"
          helpBubbleContent={InitIsSettingsStickyHelpText()}
          customHandler={() => {
            const newValue = !panel.initialDisplayState.isSettingsSticky;
            const shouldUpdateIsSettingsExpanded =
              newValue && !panel.initialDisplayState.isSettingsExpanded;
            updatePanel({
              id: panel.id,
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
          panel={panel}
          settingKey={PanelDisplayStateKeys.isSettingsExpanded}
          disableKey={PanelDisplayStateKeys.isSettingsSticky}
          label="Settings Expanded"
          helpBubbleContent={InitIsSettingsExpandedHelpText()}
        />
      </div>
    </div>
  );
}
