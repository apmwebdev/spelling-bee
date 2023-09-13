import { HintPanel } from "./HintPanel";
import { hintApiSlice, selectPanelIds, selectPanels } from "@/features/hints/hintApiSlice";
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
  arrayMove,
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
  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const maybeActivePanel = panels.find((panel) => panel.id === active.id);
    if (maybeActivePanel) {
      setActivePanel(maybeActivePanel);
    }
  };
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    console.log("active:", active.id, "over:", over?.id);
    if (active.id !== over?.id) {
      console.log("move");
    } else {
      console.log("no move");
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
