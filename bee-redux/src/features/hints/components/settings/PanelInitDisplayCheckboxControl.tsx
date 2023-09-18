import {
  PanelDisplayStateKeys,
  useUpdateHintPanelMutation,
} from "@/features/hints";
import { Checkbox } from "@/components/radix-ui/radix-checkbox";
import { ReactNode } from "react";
import { HelpBubble } from "@/components/HelpBubble";
import { capitalizeFirstLetter } from "@/util";

export function PanelInitDisplayCheckboxControl({
  panelId,
  settingKey,
  currentValue,
  disabled,
  label,
  helpBubbleContent,
  customHandler,
}: {
  panelId: number;
  settingKey: PanelDisplayStateKeys;
  currentValue: boolean;
  disabled?: boolean;
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
        id: panelId,
        debounceField: `initDisplay${capitalizeFirstLetter(settingKey)}`,
        initialDisplayState: {
          [settingKey]: !currentValue,
        },
      });
    }
  };
  return (
    <div className="PanelInitDisplayControl">
      <label>
        <Checkbox
          checked={currentValue}
          disabled={disabled}
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
