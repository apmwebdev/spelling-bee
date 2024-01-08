/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HintPanelData } from "@/features/hintPanels/types/hintPanelTypes";
import { HintPanel } from "@/features/hintPanels";

export function SortableHintPanel({ panel }: { panel: HintPanelData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: panel.uuid });
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
