import { HintPanelData, PanelDisplayStateKeys } from "@/features/hints";
import { PanelInitDisplayCheckboxControl } from "@/features/hints/components/settings/PanelInitDisplayCheckboxControl";
import {
  InitIsBlurredHelpText,
  InitIsExpandedHelpText,
  InitIsSettingsExpandedHelpText,
  InitIsSettingsStickyHelpText,
  InitIsStickyHelpText,
} from "@/features/hints/components/settings/helpText";

export function PanelInitialDisplayControls({
  panel,
}: {
  panel: HintPanelData;
}) {
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
