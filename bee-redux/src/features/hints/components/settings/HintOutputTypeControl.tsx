import {
  SubstringHintOutputKeys,
  SubstringHintOutputOptions,
} from "@/features/hints";
import { useUpdateHintPanelMutation } from "@/features/hints/hintApiSlice";
import * as Select from "@radix-ui/react-select";
import {
  SelectContentWithPortal,
  SelectItem,
  SelectTrigger,
} from "@/components/radix-ui/radix-select";
import uniqid from "uniqid";

export function HintOutputTypeControl({
  panelId,
  outputType,
}: {
  panelId: number;
  outputType: SubstringHintOutputKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: SubstringHintOutputKeys) => {
    updatePanel({
      id: panelId,
      debounceField: "outputType",
      typeData: {
        outputType: value,
      },
    });
  };
  return (
    <div className="HintOutputTypeControl">
      <span>Output:</span>
      <Select.Root value={outputType} onValueChange={handleChange}>
        <SelectTrigger className="SmallSelect" style={{ width: "12em" }} />
        <SelectContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(SubstringHintOutputOptions).map((key) => (
              <SelectItem
                key={uniqid()}
                value={key}
                itemText={SubstringHintOutputOptions[key].title}
              />
            ))}
          </Select.Viewport>
        </SelectContentWithPortal>
      </Select.Root>
    </div>
  );
}
