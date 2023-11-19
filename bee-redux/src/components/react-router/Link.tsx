/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { To, useHref, useLinkClickHandler } from "react-router-dom";
import React, { HTMLAttributeAnchorTarget, useContext } from "react";
import { GlobalContext } from "@/providers/GlobalContext";

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => any;
  replace?: boolean;
  state?: any;
  target?: HTMLAttributeAnchorTarget;
  reloadDocument?: boolean;
  preventScrollReset?: boolean;
  relative?: "route" | "path";
  to: To;
};

/**
 * Custom React Router Link component that dispatches a closePopups event when
 * clicked. This is so that Radix UI popup elements (dialogs, modals, etc.) will
 * close themselves when navigation happens even though the page (usually)
 * doesn't actually reload.
 * @param {LinkProps}
 * @constructor
 * @see https://reactrouter.com/en/main/hooks/use-link-click-handler
 */
export const Link = ({
  onClick,
  replace = false,
  state,
  target,
  to,
  children,
  ...rest
}: LinkProps) => {
  const { closePopupsEvent } = useContext(GlobalContext);
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
  });

  return (
    <a
      {...rest}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        window.dispatchEvent(closePopupsEvent);
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      }}
      target={target}
    >
      {children}
    </a>
  );
};
