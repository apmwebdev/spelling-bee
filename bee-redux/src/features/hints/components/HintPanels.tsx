import { HintPanel } from "./HintPanel";
import {
  hintApiSlice,
  selectPanelIds,
  selectPanels,
  useChangeHintPanelOrderMutation,
} from "@/features/hints/hintApiSlice";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppSelector } from "@/app/hooks";
import { SortableHintPanel } from "@/features/hints/components/SortableHintPanel";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { HintPanelData } from "@/features/hints";

export function HintPanels() {
  const currentProfile =
    hintApiSlice.endpoints.getCurrentHintProfile.useQueryState(undefined);
  const panels = useAppSelector(selectPanels);
  const panelIds = useAppSelector(selectPanelIds);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activePanel, setActivePanel] = useState<HintPanelData | null>(null);
  const [changeHintPanelOrder] = useChangeHintPanelOrderMutation();

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const maybeActivePanel = panels.find((panel) => panel.id === active.id);
    if (maybeActivePanel) {
      setActivePanel(maybeActivePanel);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      changeHintPanelOrder({
        id: Number(active.id),
        oldIndex: panelIds.indexOf(Number(active.id)),
        newIndex: panelIds.indexOf(Number(over.id)),
      });
    }
    setActivePanel(null);
  };

  return (
    <div className="HintPanels">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={panelIds}
          strategy={verticalListSortingStrategy}
        >
          {currentProfile.data?.panels.map((panel) => {
            return <SortableHintPanel key={panel.id} panel={panel} />;
          })}
        </SortableContext>
        <DragOverlay>
          {activePanel ? (
            <HintPanel panel={activePanel} isOverlay={true} isDragging={true} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
