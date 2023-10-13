import * as Dialog from "@radix-ui/react-dialog";
import { DialogContentProps, DialogProps } from "@radix-ui/react-dialog";
import { ReactNode, RefAttributes, useEffect, useState } from "react";
import { composeClasses } from "@/util";
import { IconButtonTypes } from "@/components/IconButton";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@/components/radix-ui/radix-visually-hidden";
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
        className={composeClasses("DialogContent", props.className ?? "")}
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
