import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ScrollAreaScrollbarProps } from "@radix-ui/react-scroll-area";
import { RefAttributes } from "react";
import classNames from "classnames/dedupe";
import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export { Root, Viewport } from "@radix-ui/react-scroll-area";

export const Scrollbar = (
  props: IntrinsicAttributes &
    ScrollAreaScrollbarProps &
    RefAttributes<HTMLDivElement>,
) => (
  <ScrollArea.Scrollbar
    {...props}
    className={classNames("ScrollAreaScrollbar", props.className)}
  >
    <ScrollArea.Thumb className="ScrollAreaThumb" />
  </ScrollArea.Scrollbar>
);
