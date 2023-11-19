/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

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
