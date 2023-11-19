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
import { Icon } from "@iconify/react";
import { MoreActions } from "@/features/auth/components/MoreActions";
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";
import { useNavigate } from "react-router-dom";

export function MobileAuthLinks() {
  const navigate = useNavigate();
  const handleLoginSelect = () => navigate("/auth/login");
  const handleSignupSelect = () => navigate("/auth/signup");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showIcon={false}>
        <Icon icon="mdi:user" />
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal collisionPadding={8}>
        <DropdownMenu.Item onSelect={handleLoginSelect}>
          <DropdownLinkIcon />
          Log in
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleSignupSelect}>
          <DropdownLinkIcon />
          Sign up
        </DropdownMenu.Item>
        <MoreActions />
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
