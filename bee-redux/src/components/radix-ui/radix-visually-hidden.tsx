import * as RadixVisuallyHidden from "@radix-ui/react-visually-hidden";
import { ReactNode } from "react";

export const VisuallyHidden = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) => {
  if (disabled) return children;
  return <RadixVisuallyHidden.Root>{children}</RadixVisuallyHidden.Root>;
};
