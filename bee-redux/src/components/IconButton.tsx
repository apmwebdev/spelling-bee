import { Icon } from "@iconify/react";
import { composeClasses } from "@/utils/utils";
import { BasicTooltip } from "@/components/BasicTooltip";

export interface IconButtonTypeData {
  name: string;
  icon: string;
}

export enum IconButtonTypeKeys {
  Create = "Create",
  Edit = "Edit",
  Delete = "Delete",
  Save = "Save",
  Duplicate = "Duplicate",
  Close = "Close",
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
    icon: "",
  },
  Delete: {
    name: "delete",
    icon: "material-symbols:delete-outline",
  },
  Save: {
    name: "save",
    icon: "",
  },
  Duplicate: {
    name: "duplicate",
    icon: "mdi:content-copy",
  },
  Close: {
    name: "close",
    icon: "mdi:close-thick",
  },
};

export interface IconButtonProps {
  type: IconButtonTypeKeys;
  tooltip: string;
  onClick?: Function;
  className?: string;
}

export function IconButton({
  type,
  onClick,
  tooltip,
  className,
}: IconButtonProps) {
  return (
    <BasicTooltip text={tooltip}>
      <button
        type="button"
        onClick={onClick ? onClick() : null}
        className={composeClasses("IconButton", className ?? "")}
      >
        <Icon icon={IconButtonTypes[type].icon} />
      </button>
    </BasicTooltip>
  );
}
