/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Icon } from "@iconify/react";
import { BasicTooltip } from "@/components/BasicTooltip";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import classNames from "classnames/dedupe";

type IconButtonTypeData = {
  name: string;
  icon: string;
};

export enum IconButtonTypeKeys {
  Create = "Create",
  Edit = "Edit",
  Delete = "Delete",
  Save = "Save",
  Duplicate = "Duplicate",
  Close = "Close",
  Show = "Show",
  Hide = "Hide",
  Settings = "Settings",
  DragVertical = "DragVertical",
  Shuffle = "Shuffle",
}

type IconButtonTypesData = {
  [key in IconButtonTypeKeys]: IconButtonTypeData;
};

export const IconButtonTypes: IconButtonTypesData = {
  Create: {
    name: "create",
    icon: "material-symbols:add",
  },
  Edit: {
    name: "edit",
    icon: "material-symbols:edit",
  },
  Delete: {
    name: "delete",
    icon: "material-symbols:delete-outline",
  },
  Save: {
    name: "save",
    icon: "mdi:checkbox-outline",
  },
  Duplicate: {
    name: "duplicate",
    icon: "mdi:content-copy",
  },
  Close: {
    name: "close",
    icon: "mdi:close-thick",
  },
  Show: {
    name: "show",
    icon: "mdi:show",
  },
  Hide: {
    name: "show",
    icon: "mdi:hide",
  },
  Settings: {
    name: "settings",
    icon: "mdi:cog",
  },
  DragVertical: {
    name: "dragVertical",
    icon: "mdi:drag",
  },
  Shuffle: {
    name: "shuffle",
    icon: "el:refresh",
  },
};

type IconButtonProps = {
  type: IconButtonTypeKeys;
  tooltip?: string;
  onClick?: Function;
  className?: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
};

export function IconButton({
  type,
  onClick,
  tooltip,
  className,
  attributes,
  listeners,
}: IconButtonProps) {
  return (
    <BasicTooltip tooltipContent={tooltip} disabled={tooltip === undefined}>
      <button
        type="button"
        onClick={onClick ? () => onClick() : undefined}
        className={classNames("IconButton", className)}
        {...attributes}
        {...listeners}
      >
        <Icon icon={IconButtonTypes[type].icon} />
      </button>
    </BasicTooltip>
  );
}
