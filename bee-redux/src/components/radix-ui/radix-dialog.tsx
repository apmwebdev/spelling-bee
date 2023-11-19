/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import * as Dialog from "@radix-ui/react-dialog";
import { DialogContentProps, DialogProps } from "@radix-ui/react-dialog";
import { ReactNode, RefAttributes, useEffect, useState } from "react";
import { IconButtonTypes } from "@/components/IconButton";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@/components/radix-ui/radix-visually-hidden";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Trigger } from "@radix-ui/react-dialog";

export const Root = (props: IntrinsicAttributes & DialogProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen((o) => !o);
  };
  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("closePopups", close);
    return () => {
      window.removeEventListener("closePopups", close);
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={toggleOpen}>
      {props.children}
    </Dialog.Root>
  );
};

export const ContentWithPortal = (
  props: IntrinsicAttributes &
    DialogContentProps &
    RefAttributes<HTMLDivElement> & {
      title: ReactNode;
      description: ReactNode;
      hideDescription?: boolean;
    },
) => {
  const { title, description, hideDescription, ...otherProps } = props;
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content
        {...otherProps}
        className={classNames("DialogContent", props.className)}
      >
        <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
        <VisuallyHidden disabled={!hideDescription}>
          <Dialog.Description className="DialogDescription">
            {description}
          </Dialog.Description>
        </VisuallyHidden>
        {props.children}
        <Dialog.Close className="IconButton CloseButton DialogClose">
          <Icon icon={IconButtonTypes.Close.icon} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
