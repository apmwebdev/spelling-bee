import * as Select from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";
import { CSSProperties } from "react";
import {
  LetterPanelLocationKeys,
  LetterPanelLocationOptions,
} from "@/features/hintPanelType_letter";
import {
  SearchPanelLocationKeys,
  SearchPanelLocationOptions,
} from "@/features/hintPanelType_search";
import { PanelTypes, useUpdateHintPanelMutation } from "@/features/hintPanels";

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
        <Select.Trigger className="SmallSelect" style={{ width: "12em" }} />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(
              panelType === PanelTypes.Letter
                ? LetterPanelLocationOptions
                : SearchPanelLocationOptions,
            ).map((key) => (
              <Select.Item
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
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
