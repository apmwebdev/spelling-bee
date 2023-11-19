/*
  Super Spelling Bee - A vocabulary game with integrated hints
  Copyright (C) 2023 Austin Miller

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  See the LICENSE file or https://www.gnu.org/licenses/ for more details.
*/

import { Icon, InlineIcon } from "@iconify/react";
import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { useLogoutMutation } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";

export function UserMenu({ isMobile }: { isMobile?: boolean }) {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleAccountSelect = () => {
    navigate("/auth/account");
  };

  const handleLogoutSelect = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showIcon={!isMobile} className="UserMenuTrigger">
        <Icon icon="mdi:account" className="DropdownMenuIconTrigger" />
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal>
        <DropdownMenu.Item>
          <DropdownLinkIcon />
          Hint Profiles
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownLinkIcon />
          Puzzles
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownLinkIcon />
          Saved Words
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleAccountSelect}>
          <DropdownLinkIcon />
          Account
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={handleLogoutSelect}>
          <InlineIcon icon="mdi:logout" className="DropdownMenuItem_icon" />
          Log Out
        </DropdownMenu.Item>
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
