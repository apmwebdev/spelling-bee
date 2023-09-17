import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HintPanelData } from "@/features/hints";
import { HintPanel } from "@/features/hints/components/HintPanel";

export function SortableHintPanel({ panel }: { panel: HintPanelData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: panel.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <HintPanel
      ref={setNodeRef}
      panel={panel}
      isOverlay={false}
      isDragging={isDragging}
      isSorting={isSorting}
      style={style}
      attributes={attributes}
      listeners={listeners}
    />
  );
}
