import { IconButton, IconButtonTypeKeys } from "@/components/IconButton";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export function DragHandle({
  attributes,
  listeners,
}: {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}) {
  return (
    <IconButton
      type={IconButtonTypeKeys.DragVertical}
      className="DragHandle HintPanelHeaderButton"
      attributes={attributes}
      listeners={listeners}
    />
  );
}
