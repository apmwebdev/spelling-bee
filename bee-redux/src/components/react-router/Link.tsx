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
