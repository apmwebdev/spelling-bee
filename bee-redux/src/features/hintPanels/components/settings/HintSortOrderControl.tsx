import * as ToggleGroup from "@/components/radix-ui/radix-toggle-group";
import { SortOrderKeys } from "@/types";
import { useUpdateHintPanelMutation } from "@/features/hintPanels";

export function HintSortOrderControl({
  panelId,
  sortOrder,
}: {
  panelId: number;
  sortOrder: SortOrderKeys;
}) {
  const [updatePanel] = useUpdateHintPanelMutation();
  const handleChange = (value: SortOrderKeys) => {
    updatePanel({
      id: panelId,
      debounceField: "sortOrder",
      typeData: {
        sortOrder: value,
      },
    });
  };

  return (
    <div className="HintSortOrderControl">
      <span>Sort Order:</span>
      <ToggleGroup.Root
        type="single"
        value={sortOrder}
        onValueChange={handleChange}
      >
        <ToggleGroup.Item value={SortOrderKeys.asc}>Asc</ToggleGroup.Item>
        <ToggleGroup.Item value={SortOrderKeys.desc}>Desc</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}
