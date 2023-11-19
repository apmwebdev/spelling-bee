/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
