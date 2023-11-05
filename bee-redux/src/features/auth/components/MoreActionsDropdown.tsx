import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { MoreActions } from "@/features/auth/components/MoreActions";

export function MoreActionsDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>More actions</DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal align="start">
        <MoreActions />
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
