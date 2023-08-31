import {
  LetterPanelLocationKeys,
  LetterPanelLocationOptions,
} from "@/features/hints";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/react-select";
import uniqid from "uniqid";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";

export function LetterPanelLocationControl({
  panelId,
  location,
}: {
  panelId: number;
  location: LetterPanelLocationKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: LetterPanelLocationKeys) => {
    updatePanel({
      id: panelId,
      debounceField: "location",
      typeData: {
        location: value,
      },
    });
  };
  return (
    <div className="LetterPanelLocationControl">
      <span>Location:</span>
      <Select.Root value={location} onValueChange={handleChange}>
        <SelectTrigger className="SmallSelect" />
        <SelectContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(LetterPanelLocationOptions).map((key) => (
              <SelectItem
                key={uniqid()}
                value={key}
                itemText={LetterPanelLocationOptions[key].title}
              />
            ))}
          </Select.Viewport>
        </SelectContentWithPortal>
      </Select.Root>
    </div>
  );
}
