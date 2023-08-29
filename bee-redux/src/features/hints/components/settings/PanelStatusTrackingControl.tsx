import {
  HintPanelData,
  StatusTrackingKeys,
  StatusTrackingOptions,
} from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/react-select";
import uniqid from "uniqid";

export function PanelStatusTrackingControl({
  panel,
}: {
  panel: HintPanelData;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: string) => {
    //Trust me bro
    const typedValue = value as StatusTrackingKeys;
    updatePanel({
      id: panel.id,
      debounceField: "statusTracking",
      statusTracking: typedValue,
    });
  };

  return (
    <div className="GeneralPanelSettingsStatusTracking">
      <span>Display:</span>
      <Select.Root
        value={panel.statusTracking as string}
        onValueChange={handleChange}
      >
        <SelectTrigger className="SmallSelect" />
        <SelectContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(StatusTrackingOptions).map((key) => {
              return (
                <SelectItem
                  key={uniqid()}
                  value={key}
                  itemText={StatusTrackingOptions[key].compactTitle}
                />
              );
            })}
          </Select.Viewport>
        </SelectContentWithPortal>
      </Select.Root>
    </div>
  );
}
