import {
  LetterPanelLocationKeys,
  LetterPanelLocationOptions,
  PanelTypes,
  SearchPanelLocationKeys,
  SearchPanelLocationOptions,
} from "@/features/hints";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/radix-select";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import uniqid from "uniqid";
import { CSSProperties } from "react";

export function HintLocationControl({
  panelId,
  location,
  panelType,
  style,
}: {
  panelId: number;
  location: LetterPanelLocationKeys | SearchPanelLocationKeys;
  panelType: PanelTypes;
  style?: CSSProperties;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();

  const handleChange = (
    newLocation: LetterPanelLocationKeys | SearchPanelLocationKeys,
  ) => {
    updatePanel({
      id: panelId,
      debounceField: "location",
      typeData: {
        location: newLocation,
      },
    });
  };

  return (
    <div className="LetterPanelLocationControl" style={style}>
      <span>Location:</span>
      <Select.Root value={location} onValueChange={handleChange}>
        <SelectTrigger className="SmallSelect" style={{ width: "12em" }} />
        <SelectContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(
              panelType === PanelTypes.Letter
                ? LetterPanelLocationOptions
                : SearchPanelLocationOptions,
            ).map((key) => (
              <SelectItem
                key={uniqid()}
                value={key}
                itemText={
                  panelType === PanelTypes.Letter
                    ? LetterPanelLocationOptions[key].title
                    : SearchPanelLocationOptions[key].title
                }
              />
            ))}
          </Select.Viewport>
        </SelectContentWithPortal>
      </Select.Root>
    </div>
  );
}
