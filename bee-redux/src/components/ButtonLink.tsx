import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { composeClasses } from "@/utils";
import { BasicTooltip } from "@/components/BasicTooltip";

export function ButtonLink({
  to,
  tooltip,
  disabledTooltip,
  className,
  disabled,
  children,
}: {
  to: string;
  tooltip?: string;
  className?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  children?: ReactNode;
}) {
  if (disabled) {
    return (
      <BasicTooltip
        tooltipContent={disabledTooltip ? disabledTooltip : ""}
        disabled={disabledTooltip === undefined}
      >
        <div className={composeClasses("ButtonLink disabled", className ?? "")}>
          {children}
        </div>
      </BasicTooltip>
    );
  }
  return (
    <BasicTooltip
      tooltipContent={tooltip ? tooltip : ""}
      disabled={tooltip === undefined}
    >
      <Link to={to} className={composeClasses("ButtonLink", className ?? "")}>
        {children}
      </Link>
    </BasicTooltip>
  );
}
