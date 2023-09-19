import {
  SubstringHintOutputKeys,
  SubstringHintOutputOptions,
  useUpdateHintPanelMutation,
} from "@/features/hints";
import * as Select from "@/components/radix-ui/radix-select";
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
        <Select.Trigger className="SmallSelect" style={{ width: "12em" }} />
        <Select.ContentWithPortal className="SmallSelect">
          <Select.Viewport>
            {Object.keys(SubstringHintOutputOptions).map((key) => (
              <Select.Item
                key={uniqid()}
                value={key}
                itemText={SubstringHintOutputOptions[key].title}
              />
            ))}
          </Select.Viewport>
        </Select.ContentWithPortal>
      </Select.Root>
    </div>
  );
}
