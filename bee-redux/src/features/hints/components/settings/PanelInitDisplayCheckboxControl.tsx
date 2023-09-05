import { HintPanelData, PanelDisplayStateKeys } from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import { Checkbox } from "@/components/radix-ui/react-checkbox";
import { ReactNode } from "react";
import { HelpBubble } from "@/components/HelpBubble";
import { capitalizeFirstLetter } from "@/utils";

export function PanelInitDisplayCheckboxControl({
  panel,
  settingKey,
  disableKey,
  label,
  helpBubbleContent,
  customHandler,
}: {
  panel: HintPanelData;
  settingKey: PanelDisplayStateKeys;
  disableKey?: PanelDisplayStateKeys;
  label: string;
  helpBubbleContent: ReactNode;
  customHandler?: () => void;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = () => {
    if (customHandler) {
      customHandler();
    } else {
      updatePanel({
        id: panel.id,
        debounceField: `initDisplay${capitalizeFirstLetter(settingKey)}`,
        initialDisplayState: {
          [settingKey]: !panel.initialDisplayState[settingKey],
        },
      });
    }
  };
  return (
    <div className="PanelInitDisplayControl">
      <label>
        <Checkbox
          checked={panel.initialDisplayState[settingKey]}
          disabled={
            disableKey ? panel.initialDisplayState[disableKey] : undefined
          }
          onCheckedChange={handleChange}
        />
        <div className="PanelInitDisplayControlInfo">
          <HelpBubble>{helpBubbleContent}</HelpBubble>
          <span>{label}</span>
        </div>
      </label>
    </div>
  );
}
