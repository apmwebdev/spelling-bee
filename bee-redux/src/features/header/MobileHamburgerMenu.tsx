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
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";
import { useNavigate } from "react-router-dom";

export function MobileHamburgerMenu() {
  const navigate = useNavigate();

  const handleHomeSelect = () => {
    navigate("/");
  };
  const handleLatestPuzzleSelect = () => {
    navigate("/puzzles/latest");
  };

  const handleAllPuzzlesSelect = () => {
    navigate("/");
  };

  const handleStatsSelect = () => {
    navigate("/");
  };

  const handleHelpSelect = () => {
    navigate("/");
  };

  const handleAboutSelect = () => {
    navigate("/");
  };

  const handleSearchSelect = () => {
    navigate("/");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showIcon={false} className="Header_hamburger">
        <Icon icon="mdi:menu" className="DropdownMenuIconTrigger" />
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal align="start" collisionPadding={8}>
        <DropdownMenu.Label>Super Spelling Bee</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={handleHomeSelect}>
          <DropdownLinkIcon />
          Home
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleLatestPuzzleSelect}>
          <DropdownLinkIcon />
          Latest Puzzle
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleAllPuzzlesSelect}>
          <DropdownLinkIcon />
          All Puzzles
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleStatsSelect}>
          <DropdownLinkIcon />
          Stats
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleHelpSelect}>
          <DropdownLinkIcon />
          Help
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleAboutSelect}>
          <DropdownLinkIcon />
          About
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleSearchSelect}>
          <DropdownLinkIcon />
          Search
        </DropdownMenu.Item>
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
