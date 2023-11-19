/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BasicTooltip } from "@/components/BasicTooltip";
import classNames from "classnames/dedupe";

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
        <div className={classNames("ButtonLink disabled", className)}>
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
      <Link to={to} className={classNames("ButtonLink", className)}>
        {children}
      </Link>
    </BasicTooltip>
  );
}
