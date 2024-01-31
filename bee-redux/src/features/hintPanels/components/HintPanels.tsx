/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
import {
  HintPanel,
  selectPanelIds,
  selectPanels,
  SortableHintPanel,
  THintPanel,
  useChangeHintPanelOrderMutation,
} from "@/features/hintPanels";

export function HintPanels() {
  const currentProfile =
    hintProfilesApiSlice.endpoints.getCurrentHintProfile.useQueryState(
      undefined,
    );
  const panels = useAppSelector(selectPanels);
  const panelUuids = useAppSelector(selectPanelIds);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activePanel, setActivePanel] = useState<THintPanel | null>(null);
  const [changeHintPanelOrder] = useChangeHintPanelOrderMutation();

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const maybeActivePanel = panels.find((panel) => panel.uuid === active.id);
    if (maybeActivePanel) {
      setActivePanel(maybeActivePanel);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      changeHintPanelOrder({
        uuid: active.id + "",
        oldIndex: panelUuids.indexOf(active.id + ""),
        newIndex: panelUuids.indexOf(over.id + ""),
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
          items={panelUuids}
          strategy={verticalListSortingStrategy}
        >
          {currentProfile.data?.panels.map((panel) => {
            return <SortableHintPanel key={panel.uuid} panel={panel} />;
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
