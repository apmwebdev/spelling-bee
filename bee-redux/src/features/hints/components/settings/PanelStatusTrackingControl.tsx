import {
  StatusTrackingKeys,
  StatusTrackingOptions,
  useUpdateHintPanelMutation,
} from "@/features/hints";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";

export function PanelStatusTrackingControl({
  panelId,
  statusTracking,
}: {
  panelId: number;
  statusTracking: StatusTrackingKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: StatusTrackingKeys) => {
    updatePanel({
      id: panelId,
      debounceField: "statusTracking",
      statusTracking: value,
    });
  };

  return (
    <div className="GeneralPanelSettingsStatusTracking">
      <span>Display:</span>
      <Select.Root value={statusTracking} onValueChange={handleChange}>
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
