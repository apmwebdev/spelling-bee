import * as Select from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";
import {
  StatusTrackingKeys,
  StatusTrackingOptions,
} from "@/features/hintPanels/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

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
        <Select.Trigger className="SmallSelect" />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(StatusTrackingOptions).map((key) => {
              return (
                <Select.Item
                  key={uniqid()}
                  value={key}
                  itemText={StatusTrackingOptions[key].compactTitle}
                />
              );
            })}
          </Select.Viewport>
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
