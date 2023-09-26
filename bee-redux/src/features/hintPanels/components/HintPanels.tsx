import {
  HintPanel,
  selectPanelIds,
  selectPanels,
  SortableHintPanel,
  useChangeHintPanelOrderMutation,
} from "@/features/hints";
import React, { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppSelector } from "@/app/hooks";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { hintProfilesApiSlice } from "@/features/hintProfiles";
import { HintPanelData } from "@/features/hintPanels/types";

export function HintPanels() {
  const currentProfile =
    hintProfilesApiSlice.endpoints.getCurrentHintProfile.useQueryState(
      undefined,
    );
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
