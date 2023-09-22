import * as Dialog from "@radix-ui/react-dialog";
import { DialogContentProps } from "@radix-ui/react-dialog";
import { ReactNode, RefAttributes } from "react";
import { composeClasses } from "@/util";
import { IconButtonTypes } from "@/components/IconButton";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@/components/radix-ui/radix-visually-hidden";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root, Trigger } from "@radix-ui/react-dialog";

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
        <Dialog.Close className="IconButton CloseButton DialogClose">
          <Icon icon={IconButtonTypes.Close.icon} />
        </Dialog.Close>
        {props.children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};
